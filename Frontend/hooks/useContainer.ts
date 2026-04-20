import { createContext, useContext } from 'react';
// import type { AppContainer } from '../../core/di/container';

// Mocks agregados para evitar errores de compilación
// Quitar estos mocks cuando existan implementaciones reales
type AppContainer = any;

/**
 * React Context that holds the AppContainer instance.
 * Must be provided at the root of the app via ContainerProvider.
 */
const ContainerContext = createContext<AppContainer | null>(null);

/**
 * Provider component that makes the AppContainer available
 * to all child components via useContainer().
 *
 * Usage:
 * ```tsx
 * const container = createContainer(db);
 * <ContainerProvider container={container}>
 *   <App />
 * </ContainerProvider>
 * ```
 */
export const ContainerProvider = ContainerContext.Provider;

/**
 * Hook to access the AppContainer from any component.
 * Must be used within a ContainerProvider.
 *
 * @throws Error if used outside of ContainerProvider
 */
export function useContainer(): AppContainer {
  const container = useContext(ContainerContext);
  if (!container) {
    throw new Error(
      'useContainer must be used within a ContainerProvider. ' +
      'Wrap your app root with <ContainerProvider container={...}>.',
    );
  }
  return container;
}
