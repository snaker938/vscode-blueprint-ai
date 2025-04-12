// BlueprintContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

export interface IBlueprintContext {
  customComponents: Record<string, React.FC>;
  registerCustomComponent: (name: string, comp: React.FC) => void;
}

const BlueprintContext = createContext<IBlueprintContext | undefined>(
  undefined
);

interface BlueprintProviderProps {
  children: ReactNode;
}

export const BlueprintProvider: React.FC<BlueprintProviderProps> = ({
  children,
}) => {
  const [customComponents, setCustomComponents] = useState<
    Record<string, React.FC>
  >({});

  const registerCustomComponent = (name: string, comp: React.FC) => {
    setCustomComponents((prev) => ({
      ...prev,
      [name]: comp,
    }));
  };

  return (
    <BlueprintContext.Provider
      value={{ customComponents, registerCustomComponent }}
    >
      {children}
    </BlueprintContext.Provider>
  );
};

export default BlueprintContext;
