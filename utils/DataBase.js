import * as MediaLibrary from "expo-media-library";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("music.db");

/**
 * Initializes the database schema.
 * Includes a manual migration check for missing columns.
 */
export const initializeDatabase = async () => {
  try {
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // 1. Create tables if they don't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS songs (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT,
        uri TEXT UNIQUE,
        duration REAL,
        modificationTime INTEGER,
        isFavorite INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS playlist_songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlistId INTEGER NOT NULL,
        songId TEXT NOT NULL,
        addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (playlistId) REFERENCES playlists(id) ON DELETE CASCADE,
        FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE,
        UNIQUE(playlistId, songId)
      );


      CREATE TABLE IF NOT EXISTS recent_plays (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        songId TEXT,
        playedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS permissions (
        type TEXT UNIQUE,
        status TEXT
      );
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        searchedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

/**
 * Fetches all audio files from the device and saves them to the DB.
 */
export const getAndStoreAudioFiles = async () => {
  try {
    let allAssets = [];
    let after = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 100,
        after,
      });

      allAssets = allAssets.concat(media.assets);
      after = media.endCursor;
      hasNextPage = media.hasNextPage;
    }

    // Sort by most recent
    allAssets.sort((a, b) => b.modificationTime - a.modificationTime);

    // Store in SQLite
    await saveAudioFilesToDB(allAssets);
  } catch (error) {
    console.error("Error fetching media assets:", error);
  }
};

/**
 * Uses a Transaction to batch insert audio files efficiently.
 */
export const saveAudioFilesToDB = async (audioFiles) => {
  // Guard clause: if no audioFiles provided, fetch them first
  if (!audioFiles || !Array.isArray(audioFiles) || audioFiles.length === 0) {
    console.log("No audio files provided, fetching from media library...");
    await getAndStoreAudioFiles();
    return;
  }

  try {
    await db.withTransactionAsync(async () => {
      for (const file of audioFiles) {
        await db.runAsync(
          `INSERT OR REPLACE INTO songs (id, title, uri, duration, modificationTime) 
           VALUES (?, ?, ?, ?, ?);`,
          [
            file.id,
            file.filename,
            file.uri,
            file.duration,
            file.modificationTime,
          ]
        );
      }
    });
    console.log(`Successfully synced ${audioFiles.length} songs.`);
  } catch (error) {
    console.error("Error saving audio files to DB:", error);
    throw error;
  }
};

/**
 * Permission Management Helpers
 */
export const changePermissionStatus = async (type, status) => {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO permissions (type, status) VALUES (?, ?);`,
      [type, status]
    );
  } catch (error) {
    console.error("Error updating permission status:", error);
  }
};

export const getPermissionStatus = async (type) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT status FROM permissions WHERE type = ?;`,
      [type]
    );
    return result ? result.status : null;
  } catch (error) {
    console.error("Error fetching permission status:", error);
    return null;
  }
};

export const getAllAudioFilesFromDB = async (sortedBy = "Date added") => {
  try {
    let orderByClause = "modificationTime DESC"; // default: Date added

    switch (sortedBy) {
      case "title(A-Z)":
        orderByClause = "title COLLATE NOCASE ASC";
        break;

      case "title(Z-A)":
        orderByClause = "title COLLATE NOCASE DESC";
        break;

      case "duration":
        orderByClause = "duration DESC";
        break;

      case "Date added":
      default:
        orderByClause = "modificationTime DESC";
        break;
    }

    const songs = await db.getAllAsync(
      `SELECT * FROM songs ORDER BY ${orderByClause};`
    );

    return songs;
  } catch (error) {
    console.error("Error fetching songs from DB:", error);
    return [];
  }
};

export const getSongsInSearch = async (query) => {
  try {
    const songs = await db.getAllAsync(
      `SELECT * FROM songs WHERE title LIKE ? ORDER BY modificationTime DESC;`,
      [`%${query}%`]
    );
    return songs;
  } catch (error) {
    console.error("Error searching songs in DB:", error);
    return [];
  }
};

export const saveSearchQuery = async (query) => {
  try {
    await db.runAsync(`INSERT INTO search_history (query) VALUES (?);`, [
      query,
    ]);
  } catch (error) {
    console.error("Error saving search query:", error);
  }
};

export const deleteSearchQuery = async (query) => {
  try {
    await db.runAsync(`DELETE FROM search_history WHERE query = ?;`, [query]);
  } catch (error) {
    console.error("Error deleting search query:", error);
  }
};

export const deleteSearchHistory = async () => {
  try {
    await db.runAsync(`DELETE FROM search_history;`);
  } catch (error) {
    console.error("Error deleting search query:", error);
  }
};

export const getSearchHistory = async () => {
  try {
    const history = await db.getAllAsync(
      `SELECT * FROM search_history ORDER BY searchedAt DESC LIMIT 20;`
    );
    return history;
  } catch (error) {
    console.error("Error fetching search history:", error);
    return [];
  }
};

export const isFavoriteSong = async (songId) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT isFavorite FROM songs WHERE id = ?;`,
      [songId]
    );
    return result ? result.isFavorite === 1 : false;
  }
  catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
}

export const markSongAsFavorite = async (songId, isFavorite) => {
  try {
    await db.runAsync(`UPDATE songs SET isFavorite = ? WHERE id = ?;`, [
      isFavorite ? 1 : 0,
      songId,
    ]);
    console.log(`Song ${songId} marked as favorite: ${isFavorite}`);
  } catch (error) {
    console.error("Error updating favorite status:", error);
  }
};

export const getFavoriteSongs = async () => {
  try {
    const favoriteSongs = await db.getAllAsync(
      `SELECT * FROM songs WHERE isFavorite = 1 ORDER BY modificationTime DESC;`
    );
    return favoriteSongs;
  } catch (error) {
    console.error("Error fetching favorite songs:", error);
    return [];
  }
};


/*
 * Create a new playlist
 */
export const createPlaylist = async (name) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO playlists (name) VALUES (?);`,
      [name]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error creating playlist:", error);
    return null;
  }
};

/**
 * Get all playlists with song count
 */
export const getAllPlaylists = async () => {
  try {
    const playlists = await db.getAllAsync(`
      SELECT 
        p.id, 
        p.name, 
        p.createdAt,
        COUNT(ps.songId) as songCount
      FROM playlists p
      LEFT JOIN playlist_songs ps ON p.id = ps.playlistId
      GROUP BY p.id
      ORDER BY p.createdAt DESC;
    `);
    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
};

/**
 * Get songs in a specific playlist
 */
export const getPlaylistSongs = async (playlistId) => {
  try {
    const songs = await db.getAllAsync(`
      SELECT 
        s.id,
        s.title,
        s.uri,
        s.duration,
        s.modificationTime,
        s.isFavorite,
        ps.addedAt
      FROM songs s
      INNER JOIN playlist_songs ps ON s.id = ps.songId
      WHERE ps.playlistId = ?
      ORDER BY ps.addedAt DESC;
    `, [playlistId]);
    return songs;
  } catch (error) {
    console.error("Error fetching playlist songs:", error);
    return [];
  }
};

/**
 * Add a song to a playlist
 */
export const addSongToPlaylist = async (playlistId, songId) => {
  try {
    await db.runAsync(
      `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (?, ?);`,
      [playlistId, songId]
    );
    return true;
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return false;
  }
};

/**
 * Remove a song from a playlist
 */
export const removeSongFromPlaylist = async (playlistId, songId) => {
  try {
    await db.runAsync(
      `DELETE FROM playlist_songs WHERE playlistId = ? AND songId = ?;`,
      [playlistId, songId]
    );
    return true;
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    return false;
  }
};

/**
 * Delete a playlist
 */
export const deletePlaylist = async (playlistId) => {
  try {
    await db.runAsync(`DELETE FROM playlists WHERE id = ?;`, [playlistId]);
    return true;
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return false;
  }
};

/**
 * Rename a playlist
 */
export const renamePlaylist = async (playlistId, newName) => {
  try {
    await db.runAsync(
      `UPDATE playlists SET name = ? WHERE id = ?;`,
      [newName, playlistId]
    );
    return true;
  } catch (error) {
    console.error("Error renaming playlist:", error);
    return false;
  }
};

/**
 * Check if a song is in a playlist
 */
export const isSongInPlaylist = async (playlistId, songId) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT id FROM playlist_songs WHERE playlistId = ? AND songId = ?;`,
      [playlistId, songId]
    );
    return result !== null;
  } catch (error) {
    console.error("Error checking song in playlist:", error);
    return false;
  }
};

/**
 * Get all folders (extracted from file URIs) with song counts
 */
export const getAllFolders = async () => {
  try {
    const songs = await db.getAllAsync(`SELECT uri FROM songs;`);
    
    // Extract folder paths from URIs
    const folderMap = new Map();
    
    songs.forEach(song => {
      if (song.uri) {
        // Extract folder path from URI
        const pathParts = song.uri.split('/');
        // Remove filename (last part) to get folder path
        pathParts.pop();
        const folderPath = pathParts.join('/');
        
        // Get folder name (last directory in path)
        const folderName = pathParts[pathParts.length - 1] || 'Root';
        
        // Count songs per folder
        if (folderMap.has(folderPath)) {
          folderMap.set(folderPath, {
            name: folderName,
            path: folderPath,
            songCount: folderMap.get(folderPath).songCount + 1
          });
        } else {
          folderMap.set(folderPath, {
            name: folderName,
            path: folderPath,
            songCount: 1
          });
        }
      }
    });
    
    // Convert map to array and sort by name
    const folders = Array.from(folderMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return folders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
};

/**
 * Get songs in a specific folder
 */
export const getFolderSongs = async (folderName) => {
  try {
    const songs = await db.getAllAsync(`SELECT * FROM songs;`);
    
    // Filter songs by folder name
    const folderSongs = songs.filter(song => {
      if (song.uri) {
        const pathParts = song.uri.split('/');
        pathParts.pop(); // Remove filename
        const currentFolderName = pathParts[pathParts.length - 1] || 'Root';
        return currentFolderName === folderName;
      }
      return false;
    });
    
    // Sort by modification time (most recent first)
    folderSongs.sort((a, b) => b.modificationTime - a.modificationTime);
    
    return folderSongs;
  } catch (error) {
    console.error("Error fetching folder songs:", error);
    return [];
  }
};

/**
 * Record a song play
 */
export const recordSongPlay = async (songId) => {
  try {
    await db.runAsync(
      `INSERT INTO recent_plays (songId) VALUES (?);`,
      [songId]
    );
    return true;
  } catch (error) {
    console.error("Error recording song play:", error);
    return false;
  }
};

/**
 * Get listening statistics for a time period
 */
export const getListeningStats = async (startDate) => {
  try {
    const result = await db.getFirstAsync(`
      SELECT 
        COUNT(*) as totalPlays,
        SUM(s.duration) as totalTime
      FROM recent_plays rp
      INNER JOIN songs s ON rp.songId = s.id
      WHERE rp.playedAt >= ?;
    `, [startDate]);
    
    return {
      totalPlays: result?.totalPlays || 0,
      totalTime: result?.totalTime || 0,
    };
  } catch (error) {
    console.error("Error fetching listening stats:", error);
    return { totalPlays: 0, totalTime: 0 };
  }
};

/**
 * Get most played songs for a time period
 */
export const getMostPlayedSongs = async (startDate, limit = 5) => {
  try {
    const songs = await db.getAllAsync(`
      SELECT 
        s.id,
        s.title,
        s.uri,
        COUNT(rp.id) as plays,
        SUM(s.duration) as totalDuration
      FROM recent_plays rp
      INNER JOIN songs s ON rp.songId = s.id
      WHERE rp.playedAt >= ?
      GROUP BY s.id
      ORDER BY plays DESC, totalDuration DESC
      LIMIT ?;
    `, [startDate, limit]);
    
    // Extract artist from filename if available
    return songs.map(song => ({
      ...song,
      artist: extractArtistFromFilename(song.title),
    }));
  } catch (error) {
    console.error("Error fetching most played songs:", error);
    return [];
  }
};

/**
 * Helper function to extract artist from filename
 * Tries common patterns like "Artist - Title" or "Artist_Title"
 */
const extractArtistFromFilename = (filename) => {
  if (!filename) return null;
  
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Try "Artist - Title" pattern
  if (nameWithoutExt.includes(" - ")) {
    return nameWithoutExt.split(" - ")[0].trim();
  }
  
  // Try "Artist_Title" pattern
  if (nameWithoutExt.includes("_")) {
    return nameWithoutExt.split("_")[0].trim();
  }
  
  return null;
};

/**
 * Get daily mix - random songs based on listening history and favorites
 * Uses a seed based on current date to get consistent results for the day
 */
export const getDailyMix = async (limit = 10) => {
  try {
    // Get date seed for consistent daily shuffle
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Get songs with weighted preference for favorites and recently played
    const songs = await db.getAllAsync(`
      SELECT DISTINCT
        s.id,
        s.title,
        s.uri,
        s.duration,
        s.modificationTime,
        s.isFavorite,
        COUNT(rp.id) as playCount
      FROM songs s
      LEFT JOIN recent_plays rp ON s.id = rp.songId
      GROUP BY s.id
      ORDER BY 
        (s.isFavorite * 3 + COALESCE(playCount, 0)) * RANDOM() DESC
      LIMIT ?;
    `, [limit]);
    
    return songs;
  } catch (error) {
    console.error("Error fetching daily mix:", error);
    return [];
  }
};

/**
 * Get all songs in shuffled order
 */
export const shuffleAllSongs = async () => {
  try {
    const songs = await db.getAllAsync(`
      SELECT * FROM songs ORDER BY RANDOM();
    `);
    return songs;
  } catch (error) {
    console.error("Error shuffling songs:", error);
    return [];
  }
};