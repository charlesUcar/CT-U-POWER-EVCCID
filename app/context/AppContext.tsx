import React, { createContext, useState, ReactNode } from "react";

interface AppContextType {
  globalBackgroundColor: string;
  setGlobalBackgroundColor: (value: string) => void;
}

const initialState = {
  globalBackgroundColor: "#C1DFE2",
  setGlobalBackgroundColor: (value: string) => {},
};

const AppContext = createContext<AppContextType>(initialState);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [globalBackgroundColor, setGlobalBackgroundColor] =
    useState<string>("#C1DFE2");

  return (
    <AppContext.Provider
      value={{ globalBackgroundColor, setGlobalBackgroundColor }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
