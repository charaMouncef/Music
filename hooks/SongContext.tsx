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
    };
const SongContext = createContext<SongContextType | undefined>(undefined);

export function SongProvider({ children }: { children: ReactNode }) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    return (
    <SongContext.Provider
        value={{
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        isOpen,
        setIsOpen,
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