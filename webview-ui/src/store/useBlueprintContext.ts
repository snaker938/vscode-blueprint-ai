// useBlueprintContext.ts

import { useContext } from 'react';
import type { IBlueprintContext } from './BlueprintContext';
import BlueprintContext from './BlueprintContext';

/**
 * A convenience hook to consume the BlueprintContext
 */
export function useBlueprintContext(): IBlueprintContext {
  const context = useContext(BlueprintContext);

  if (!context) {
    throw new Error(
      'useBlueprintContext must be used within a <BlueprintProvider>'
    );
  }

  return context;
}
