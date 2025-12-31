import { createContext, useContext, useState, ReactNode } from "react";

export type SortType =
  | "title(A-Z)"
  | "title(Z-A)"
  | "Date added"
  | "duration";

type SortContextType = {
  sortedBy: SortType;
  setSortedBy: (value: SortType) => void;
  isOpenSelect: boolean;
  setIsOpenSelect: (value: boolean) => void;
};

const SortContext = createContext<SortContextType | undefined>(undefined);

export function SortProvider({ children }: { children: ReactNode }) {
  const [sortedBy, setSortedBy] = useState<SortType>("duration");
  const [isOpenSelect, setIsOpenSelect] = useState(false);

  return (
    <SortContext.Provider
      value={{
        sortedBy,
        setSortedBy,
        isOpenSelect,
        setIsOpenSelect,
      }}
    >
      {children}
    </SortContext.Provider>
  );
}

export function useSort() {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSort must be used within a SortProvider");
  }
  return context;
}
