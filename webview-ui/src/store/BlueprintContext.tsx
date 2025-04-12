// BlueprintContext.tsx

import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

export interface IBlueprintContext {
  DynamicBlueprintComponent: React.FC | null;
  setDynamicBlueprintComponent: Dispatch<SetStateAction<React.FC | null>>;
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
  const [DynamicBlueprintComponent, setDynamicBlueprintComponent] =
    useState<React.FC | null>(null);

  return (
    <BlueprintContext.Provider
      value={{ DynamicBlueprintComponent, setDynamicBlueprintComponent }}
    >
      {children}
    </BlueprintContext.Provider>
  );
};

export default BlueprintContext;
