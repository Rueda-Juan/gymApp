# PLAN-A — Persistencia Local de Estado de Entrenamiento con Zustand + react-native-mmkv

## Objective
Implementar persistencia automática y recuperación del estado de entrenamiento activo en curso usando Zustand y react-native-mmkv, para evitar pérdida de datos ante cierres inesperados de la app.

## Scope
**In scope:**  
- Persistencia de `activeWorkout` y temporizador en `workoutStore`
- Integración de MMKV como storage backend para Zustand
- Restauración automática del entrenamiento en curso al relanzar la app
- Estrategia de invalidación y limpieza al finalizar/cancelar entrenamiento

**Out of scope:**  
- Persistencia de stores no relacionados a workout
- Sincronización multi-dispositivo
- Encriptación avanzada de datos

## Impacted Architecture
- **Data:** No impacta DB, solo storage local (MMKV)
- **Domain:** No modifica entidades ni casos de uso
- **Application:** Modifica Zustand store y hooks de workout
- **UI:** Añade lógica de restauración en pantalla de workout
- **Infra:** Añade dependencia react-native-mmkv

## Technical Steps

1. **Instalar dependencias**
   - `yarn add react-native-mmkv zustand zustand/middleware`
2. **Configurar MMKV**
   - Crear instancia global de MMKV:
     ```ts
     import { MMKV } from 'react-native-mmkv';
     export const storage = new MMKV();
     ```
3. **Integrar persist middleware en workoutStore**
   - Modificar `workoutStore.ts`:
     ```ts
     import { create } from 'zustand';
     import { persist } from 'zustand/middleware';
     import { storage } from '@/utils/storage';

     export const useWorkoutStore = create(
       persist(
         (set, get) => ({
           // ...state y acciones
         }),
         {
           name: 'workout-store',
           storage: {
             getItem: (name) => storage.getString(name),
             setItem: (name, value) => storage.set(name, value),
             removeItem: (name) => storage.delete(name),
           },
           partialize: (state) => ({
             activeWorkout: state.activeWorkout,
             restTimer: state.restTimer,
           }),
         }
       )
     );
     ```
4. **Restaurar estado al iniciar la app**
   - En el entrypoint (`_layout.tsx`), leer el estado persistido y, si existe un `activeWorkout`, mostrar modal de recuperación o restaurar automáticamente.
5. **Limpiar storage al finalizar/cancelar entrenamiento**
   - Al ejecutar la acción de finalizar/cancelar, limpiar el estado persistido (`set({ activeWorkout: null })` y trigger de `storage.removeItem`).
6. **Agregar fallback y validaciones**
   - Validar integridad del objeto restaurado (ej: workout corrupto, datos incompletos).
   - Si el workout restaurado es inválido, limpiar storage y mostrar error.

## Risks

- **CRITICAL:** Corrupción de estado persistido (ej: crash durante serialización)
- **HIGH:** Restauración de un workout inconsistente o incompleto
- **MEDIUM:** Race conditions entre escritura y lectura del storage
- **LOW:** Fugas de memoria por objetos grandes en MMKV

## Edge Cases

- App cerrada durante la serialización
- Estado persistido con workout parcialmente guardado
- Usuario cancela entrenamiento tras restauración
- Actualización de la estructura de `activeWorkout` (migraciones de store)
- Storage lleno o inaccesible

## Security Controls

- Validar ownership del workout restaurado (si multiusuario)
- No exponer datos sensibles fuera del sandbox de la app
- Limpiar storage en logout/cambio de usuario

## Testing Strategy

- **Unit:** Serialización/deserialización de workout
- **Integration:** Persistencia y restauración en flujo real (abrir/cerrar app)
- **E2E:** Simular cierre forzado de app durante entrenamiento y verificar recuperación
- **Regression:** Verificar que finalizar/cancelar limpia correctamente el storage

## Rollout Strategy

- Feature flag para activar persistencia en producción
- Canary release a usuarios internos
- Monitoreo de errores de restauración y corrupción de datos
- Logs de eventos de persistencia/restauración

## Rollback Plan

- Desactivar feature flag
- Limpiar storage MMKV en el siguiente arranque
- Restaurar store a modo volátil (sin persistencia)

## Acceptance Criteria

- El usuario puede recuperar un entrenamiento en curso tras cierre inesperado
- No se pierden sets, reps ni temporizador activos
- El storage se limpia correctamente al finalizar/cancelar
- No hay corrupción de datos ni crashes por persistencia

## Dependencies

- react-native-mmkv instalado y configurado
- Zustand store modularizado

## Rollback Severity

**HIGH** — Corrupción o pérdida de datos de entrenamiento puede afectar la confianza del usuario y la integridad de la app.
