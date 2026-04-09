# PLAN-APP-TABS — Refactor y estabilización de /app/(tabs)/

## Objective
Implementar las mejoras, correcciones y refactors apuntados en el análisis de `app/(tabs)` (archivos: `stats.tsx`, `_layout.tsx`, `history.tsx`, `index.tsx`, `routines.tsx`, `settings.tsx`) para resolver los problemas críticos y importantes detectados: evitar remounts indeseados, arreglar tipado débil, mejorar accesibilidad (A11Y), estabilizar cargas asíncronas y optimizar rendimiento de render.

## Scope
- In scope: cambios en los archivos y componentes dentro de `Frontend/app/(tabs)/` y componentes/servicios fuertemente acoplados (extracts de cards, handlers, hooks locales). Actualizaciones de tests (Jest), tipados TypeScript, y ajustes menores de utilidades compartidas.
- Out of scope: cambios en backend, esquemas de BD, APIs públicas, o reescrituras completas de librerías (solo adaptaciones y refactors locales).

## Impacted Architecture
- Data: ninguno (no hay migraciones).  
- Domain: hooks y servicios utilizados por las pantallas (posible extracción de `useRestTimer`, consolidación de `use*` hooks).  
- Application: stores y DI (import paths, mocks en tests).  
- UI: pantallas `index`, `routines`, `settings`, `history`, `stats`, y `_layout` (tab bar + mini player).  
- Infra: CI / Jest / TypeScript checks.

## Technical Steps (secuenciales, ejecutables)

PHASE 0 — Preparación
1. Crear branch: `git checkout -b chore/app-tabs-refactor` (trabajo en aislado).  
2. Verificar entorno e instalar dependencias: usar el package manager del proyecto (`yarn` o `npm`) — confirmar antes de ejecutar.  

PHASE 1 — Cambio de navegación y layout (prioridad alta)
3. `_layout.tsx` — eliminar `key={effectiveScheme}` del contenedor `Tabs` para evitar remounts de navigator.  
4. Extraer y memoizar `screenOptions` y `TabBarBackground` con `useMemo`/`useCallback` para estabilidad: crear `getScreenOptions(theme)` y memoizar por dependencias mínimas (theme, scheme).  
5. Reemplazar `StyleSheet.absoluteFill` por `StyleSheet.absoluteFillObject` cuando se mezcle con objetos dinámicos.  
6. Ajustar `tabBarLabelStyle` para evitar `marginTop: -4` (usar padding/lineHeight platform-aware).  
7. Añadir fallback estático al `BlurView` para dispositivos con reduced-motion o baja capacidad (detect via `useMotion().isReduced` o DeviceInfo).  
8. Verificar `MiniPlayer` overlay: asegurar `pointerEvents`, `zIndex` y atributos A11Y (no bloquear foco).  

PHASE 2 — Tipado, chart data y A11Y (stats.tsx)
9. Extraer y tipar `weeklyChartData` con `useMemo`:

```ts
type WeeklyChartPoint = { date: string; volume: number };
const weeklyChartData = useMemo<WeeklyChartPoint[]>(() => compute(...), [deps]);
```

10. Reemplazar mapeos inline en JSX por la variable memoizada.  
11. Añadir `accessibilityRole="button"` y `accessibilityLabel` en Pressable de items (mejora A11Y).  
12. Mejorar observability: agregar `console.error(err)` o `captureException(err)` junto a los `Toast.show` en los `catch`.

PHASE 3 — Historial (history.tsx)
13. Expandir `_searchIndex` para indexar: fecha formateada, nombre de rutina, notas y nombres de ejercicios (concatenar strings y normalizar a minúsculas).  
14. Normalizar `date` UNA sola vez al cargar (parsear a `Date` o ISO y reutilizar la forma normalizada).  
15. Anotar tipos explícitos en `map`/`filter` callbacks: `data.map((w: Workout) => ...)`.  
16. Revisar `removeClippedSubviews` en `SectionList`: deshabilitar si causa glitches con animaciones.  
17. Mejorar UX de borrado: mostrar spinner/Toast mientras se ejecuta `deleteWorkout` y evitar doble-press (disable while deleting).

PHASE 4 — Routines list & Pressables (routines.tsx)
18. Proteger llamadas async en `loadRoutines` con mounted flag o `AbortController` para evitar setState después de ununmount. Ejemplo (useFocusEffect):

```ts
useFocusEffect(
  useCallback(() => {
    let mounted = true;
    (async () => { ... if (mounted) setState(...) })();
    return () => { mounted = false; };
  }, [deps])
);
```

19. Extraer `RoutineCard` a `components/cards/RoutineCard.tsx` como `React.memo` para estabilizar `renderItem`.  
20. Estabilizar `Pressable` style function (mover a callback memoizado o a `RoutineCard`) y añadir `accessibilityRole="button"`.  

PHASE 5 — Home / index.tsx
21. Remover `// @ts-ignore` y tipar `Animated.View` que usa `sharedTransitionTag` (introducir tipo `WithSharedTransition` y un alias `const AnimatedView = Animated.View as React.ComponentType<WithSharedTransition>`).  
22. Extraer subcomponentes: `Header`, `CTA`, `LastWorkoutCard`, `RoutineCard` (Reduce tamaño del archivo; facilita tests).  
23. Reemplazar map-in-ScrollView por `FlashList` si `routines` puede crecer; sino mantener pero con memoized callbacks.  

PHASE 6 — Settings screen
24. Añadir `accessibilityRole="button"` a `Pressable` (Reset DB, Logout) y otros pressables que no lo tengan.  
25. Extraer `RestTimer` en `useRestTimer` o `RestTimerSettings` para encapsular `restTimerInput`, debounce y `applyRestTimerSeconds`.  
26. Mostrar feedback visual (spinner / disabled) durante `wipeDatabase.execute()` y evitar doble ejecución.

PHASE 7 — TypeScript, tests y CI
27. Ejecutar `tsc --noEmit` y corregir errores en orden: missing modules, implicit any (anotar tipos en map/filter), `@ts-ignore` removals.  
28. Actualizar import paths si fueron afectados por refactors o extracción de componentes.  
29. Actualizar Jest mocks: `jest.mock(...)` y `moduleNameMapper` si fuera necesario; prefer editar tests a usar nuevos imports.  
30. Ejecutar test suite e iterar hasta verde: `yarn test` or `npm test`.  
31. Hacer pruebas manuales de humo (Home, Routines, Settings, History, Stats) en emulador/dispositivo.

PHASE 8 — PR & Rollout
32. Crear PR con descripción técnica, archivo de cambios, y checklist de aceptación.  
33. Merge solo con CI verde y aprobación de reviewer.  

## Risks (priorizados)
- HIGH: eliminar `key={effectiveScheme}` sin verificar side-effects en navegación — mitigación: probar navegación profunda y estados de formularios.  
- HIGH: cambios en A11Y o remoción de `@ts-ignore` pueden revelar fallos de runtime — mitigación: `tsc --noEmit` + tests.  
- MEDIUM: extracciones (RoutineCard) pueden romper mocks/tests — mitigación: update tests + moduleNameMapper si necesario.  
- LOW: perf regressions por memoization mal aplicada — mitigación: measurements + revert small commits.

## Edge Cases
- Workouts/routines con campos faltantes (null muscles, missing routineId) — garantizar safe chaining.  
- Pantalla se desmonta durante fetch largo — proteger con mounted flag.  
- Diferencias en estilos/platform fonts que hagan `marginTop: -4` cortar etiquetas — usar padding/lineHeight condicional.

## Security Controls
- No hay cambios de DB en este plan.  
- Para acciones destructivas (Reset DB): confirmar con Alert y mostrar progreso/resultado; evitar ejecución silenciosa.  
- Asegurar que hooks que puedan exponer datos sensibles no cambien owner validation (no aplica cambios de permisos aquí).

## Testing Strategy
- Unit: tipos y utilidades (formatters, compute functions), small pure components.  
- Integration: components/cards + hooks (render with mock stores/DI).  
- Jest: actualizar mocks y snapshot tests para nuevos componentes.  
- Manual E2E (smoke): iniciar app y navegar por Home → Routines → Crear/abrir rutina → Settings reset flow → History search.  
- Acceptance: `tsc --noEmit` y `yarn test` (o `npm test`) green.

## Rollout Strategy
- Single PR gated by CI.  
- Optionally stage on a feature branch and run a quick device farm smoke before merging to main.  

## Rollback Plan
- Revert the PR via `git revert <merge-commit>` and re-run CI.  
- Rollback Severity: MEDIUM (UI regressions only; no data migrations affected).  

## Acceptance Criteria (Definition of Done)
1. `tsc --noEmit` exits 0.  
2. Full Jest suite passes.  
3. No remaining `// @ts-ignore` hiding `sharedTransitionTag` in `index.tsx`.  
4. `_layout.tsx` no contiene `key={effectiveScheme}` y Tabs no remountean al cambiar tema.  
5. `routines.tsx` protege setState post-unmount (mounted guard).  
6. `settings.tsx` muestra feedback durante `wipeDatabase.execute()` y `Pressable`s importantes exponen `accessibilityRole="button"`.  
7. `stats.tsx` usa `useMemo` para chart data y Pressable item tiene `accessibilityLabel`.  

## Dependencies
- `tsconfig` path aliases configured (`@/`).  
- CI able to run `yarn test`/`npm test` and `tsc`.  
- Access to run emulator/device for smoke tests.

---
### Quick commands

```bash
# create branch
git checkout -b chore/app-tabs-refactor

# type check
yarn tsc --noEmit   # or: npm run tsc -- --noEmit

# tests
yarn test           # or: npm test
```

---
If you want, I can now (pick one):
- A) Start the repo-wide discovery and create the branch (`chore/app-tabs-refactor`) and produce a file-by-file patch list, or
- B) Only generate the set of focused patches for the quick fixes (add accessibilityRole, mounted guard, memoize chart data, remove navigator key) so you can review smaller PRs.

Indicate `A` or `B` (and confirm package manager `yarn` or `npm`) and I will proceed.
