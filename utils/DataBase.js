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
        folder TEXT,
        isFavorite INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS favorites (
        songId TEXT PRIMARY KEY,
        FOREIGN KEY (songId) REFERENCES songs(id) ON DELETE CASCADE
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
  try {
    await db.withTransactionAsync(async () => {
      for (const file of audioFiles) {
        // Included 'folder' and ensured types match the schema
        await db.runAsync(
          `INSERT OR REPLACE INTO songs (id, title, uri, duration, modificationTime, folder) 
           VALUES (?, ?, ?, ?, ?, ?);`,
          [
            file.id,
            file.filename,
            file.uri,
            file.duration, // REAL type supports decimals
            file.modificationTime,
            file.albumId || "Unknown", // Mapping albumId to folder column
          ]
        );
      }
    });
    console.log(`Successfully synced ${audioFiles.length} songs.`);
  } catch (error) {
    console.error("Error saving audio files to DB:", error);
    throw error; // Propagate error so UI can handle it
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

export const markSongAsFavorite = async (songId, isFavorite) => {
  try {
    await db.runAsync(`UPDATE songs SET isFavorite = ? WHERE id = ?;`, [
      isFavorite ? 1 : 0,
      songId,
    ]);
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
