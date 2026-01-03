import { createContext, ReactNode, useContext, useState } from "react";

interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  isFavorite: number;
}

type SongContextType = {
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  playAllSongs: (songs: Song[], startIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
};

const SongContext = createContext<SongContextType | undefined>(undefined);

export function SongProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playAllSongs = (songs: Song[], startIndex: number = 0) => {
    if (songs.length === 0) return;
    
    setPlaylist(songs);
    setCurrentIndex(startIndex);
    setCurrentSong(songs[startIndex]);
    setIsPlaying(true);
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <SongContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        isOpen,
        setIsOpen,
        playlist,
        setPlaylist,
        currentIndex,
        setCurrentIndex,
        playAllSongs,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </SongContext.Provider>
  );
}

export function useSong() {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSong must be used within a SongProvider");
  }
  return context;
}