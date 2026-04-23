1. Problemas de Redundancia y Organización
   El problema más grave es la duplicidad de lógica entre entities, features, widgets y pages.

### Redundancia en "Active Workout"

Tienes componentes idénticos o muy similares en tres lugares diferentes:

- `src/entities/workout/ui/...`
- `src/features/activeWorkout/components/...`
- `src/widgets/activeWorkout/ui/...` (Aquí tienes de nuevo WorkoutHeader, PRCelebrationOverlay, etc.)

**Corrección:**

- **Entities:** Solo componentes atómicos y transversales (ej. `WorkoutSetRow`).
- **Features:** La lógica de acción (ej. `useSetCompletion`, `useStartWorkout`).
- **Widgets:** Aquí es donde deberías ensamblar el `ActiveWorkoutBottomBar` o el `ActiveWorkoutController`. No dupliques los mismos archivos de UI en features y widgets.

### El dilema de src/pages vs src/app

Tienes una carpeta `src/pages` y una carpeta `src/app` (Expo Router).

- **Recomendación:** Mantén las "Pages" como componentes puros que reciben props o usan hooks de la capa features/widgets, y deja que `src/app` solo actúe como el "Routing Layer" (definición de rutas y layouts).

2. Infraestructura y Archivos Faltantes
   Para una app de fitness de este calibre, faltan piezas clave:

- **src/shared/api:** Centralizar configuración de Axios/TanStack Query e interceptores de auth.
- **src/shared/lib/auth:** Lógica de autenticación y almacenamiento de tokens.
- **src/shared/ui/theme:** Centralizar `tamagui.config.ts` y tokens de diseño (espaciados, colores, animaciones). Asegurar que Features y Widgets consuman estos tokens estrictamente vía hooks o componentes de Tamagui, eliminando estilos hardcodeados.

3. Estrategia de Tests y Cobertura

- **Mocks de Base de Datos/Storage:** Tests para `src/shared/lib/storage.ts`.
- **Edge Cases en plateMath.ts:** Tests para valores críticos (negativos, 0, unidades).
- **Flujos de Integración:** Test de "happy path" completo: Crear rutina -> Iniciar Workout -> Finalizar -> Ver en Historia.
- **Visual Regression:** Snapshot testing para `BodyAnatomySvg.tsx`.
- **Factories:** Implementar `fishery` para generar objetos de prueba (`Workout`, `Exercise`).

4. Estrategia de Ejecución (Roadmap)
   Para evitar romper la app en un solo PR, seguiremos estas fases:

- **Fase 1: Limpieza Estructural.** Mover archivos a carpetas correctas según FSD sin cambiar lógica. Eliminar duplicados en `ActiveWorkout` y definir qué es Widget y qué es Feature.
- **Fase 2: Infraestructura.** Crear `shared/api`, centralizar tipos e implementar interceptores.
- **Fase 3: Tests y Cobertura.** Agregar factories y tests de integración de flujo completo.

5. Protección de Fronteras Arquitectónicas (Linting)
   Para asegurar que se respeten las reglas de FSD a largo plazo (ej. no importar un Feature dentro de un Entity):

- **Configuración de Linter:** Implementar `@conarti/eslint-plugin-feature-sliced`.
- **Regla de Oro:** Las capas superiores pueden importar de las inferiores, pero nunca al revés, ni entre hermanos de la misma capa (excepto en shared).

6. Alias de Rutas (Path Aliases)
   Limpiar `tsconfig.json` y `babel.config.js` para usar alias absolutos que faciliten el movimiento de archivos:

- `@/app/*`
- `@/pages/*`
- `@/widgets/*`
- `@/features/*`
- `@/entities/*`
- `@/shared/*`

> [!IMPORTANT]
> En Expo, esto requiere sincronizar `tsconfig.json`, `babel.config.js` (module-resolver) y asegurar que el enrutamiento en `app.json` esté alineado con estos alias absolutos para el bundler Metro.

7. Estrategia de Manejo de Estado (State Management)
   Reglas claras sobre la ubicación de los Stores (Zustand):

- **Estado de Dominio:** Reside en `entities/{entity}/model` (ej. lista de ejercicios, datos de usuario).
- **Estado de Sesión/Flujo:** Reside en `features/{feature}/model`. Aquí debe vivir la "lógica dura" del entrenamiento (completar sets, calcular volumen total, sobrecarga progresiva).
- **Estado Global/Cross-domain:** El estado del "Workout Activo" (que afecta al Mini Player y Dashboard) se centraliza en `app/store`. Estos componentes actúan como observadores de este estado pesado, mientras que la lógica de ejecución permanece aislada en la feature.
