# Flujos de testeo (E2E atómicos)

## Gestión de Ejercicios

- Crear un nuevo ejercicio personalizado con datos válidos mínimos
- Crear un ejercicio y validar error por nombre vacío
- Crear un ejercicio y seleccionar un grupo muscular específico
- Crear un ejercicio y seleccionar tipo de equipo
- Visualizar el detalle de un ejercicio existente desde el listado
- Editar el nombre de un ejercicio existente
- Editar el grupo muscular de un ejercicio
- Eliminar un ejercicio y confirmar la acción
- Cancelar la eliminación de un ejercicio
- Filtrar ejercicios por un grupo muscular y validar resultados

## Gestión de Rutinas

- Crear una rutina con nombre válido
- Crear rutina y validar error por nombre vacío
- Editar el nombre de una rutina
- Eliminar una rutina y confirmar
- Cancelar la eliminación de una rutina
- Agregar un ejercicio a una rutina
- Eliminar un ejercicio de una rutina
- Reordenar dos ejercicios dentro de una rutina
- Crear un superset entre dos ejercicios consecutivos
- Deshacer un superset existente
- Modificar la cantidad de series de un ejercicio
- Modificar el rango de repeticiones objetivo

## Inicio y Gestión del Entrenamiento

- Iniciar entrenamiento seleccionando una rutina existente
- Iniciar entrenamiento libre (sin rutina)
- Marcar un set como completado con peso y repeticiones
- Marcar un set como completado con tiempo (ejercicio temporal)
- Editar un set ya completado
- Agregar un nuevo set a un ejercicio activo
- Eliminar un set existente
- Abrir y cerrar el modal de descanso
- Abrir y cerrar el selector de peso (calculadora)
- Navegar al siguiente ejercicio
- Navegar al ejercicio anterior
- Agregar un ejercicio nuevo durante un entrenamiento activo
- Agregar una nota a un entrenamiento activo
- Finalizar entrenamiento y guardar
- Cancelar finalización (volver al entrenamiento)
- Finalizar entrenamiento y descartar

## Historial y Estadísticas

- Visualizar lista de entrenamientos recientes
- Abrir detalle de un entrenamiento desde historial
- Ver historial completo de entrenamientos
- Visualizar estadísticas de un ejercicio específico
- Visualizar mapa de calor de actividad
- Registrar un nuevo peso corporal

## Ajustes y Configuración

- Completar onboarding con datos válidos
- Validar errores en onboarding incompleto
- Cambiar configuración de notificaciones
- Cambiar tema de la aplicación
- Modificar privacidad (toggle)

1. Estado inicial controlado

Cada flujo debe poder ejecutarse con:

await device.reloadReactNative();

y datos seed como:

1 rutina existente
1 ejercicio base
🔹 2. Naming listo para código

Podés mapear directo:

it('crear rutina con nombre válido', async () => {})
🔹 3. Evitá dependencias entre tests

❌ Malo:

test B depende de que A haya creado una rutina

✔ Bueno:

cada test crea su propia rutina (o usa seed)
🔹 4. Qué NO estás incluyendo (bien hecho)

No metiste en E2E:

lógica interna compleja
cálculos
rendering fino

Eso va con Jest.

🧭 Siguiente paso lógico

Si querés avanzar bien:

Definir testID para cada interacción crítica
Crear helpers tipo:
createRoutine(name)
startWorkout()
Armar setup/teardown global
