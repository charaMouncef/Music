import { createContext, useContext, useState } from "react";

const PermissionsContext = createContext(null);

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState({
    media: "undetermined",
    notifications: "undetermined",
  });

  // Generic updater (safe + scalable)
  const setPermission = (type, status) => {
    setPermissions((prev) => ({
      ...prev,
      [type]: status,
    }));
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,      // READ
        setPermission,    // WRITE via function
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error(
      "usePermissions must be used inside PermissionsProvider"
    );
  }
  return context;
};
