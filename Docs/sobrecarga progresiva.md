# Sobrecarga Progresiva Automática y Calentamiento Automático

> Funcionamiento del algoritmo de sobrecarga progresiva — Aplicación de Rutinas de Gimnasio (MVP)

---

## 1. Objetivo del algoritmo

El algoritmo de sobrecarga progresiva tiene como objetivo **maximizar la tensión mecánica** estimulando el progreso muscular, manteniendo la fatiga bajo control y priorizando la técnica.

El sistema debe:

- Sugerir el **peso y las repeticiones** para el siguiente entrenamiento.
- Adaptarse al **rendimiento real** del usuario (basado en repeticiones y esfuerzo percibido).
- Evitar aumentos excesivos que comprometan la técnica o causen lesiones.
- Mantener una **progresión constante**.

> **Nota:** El algoritmo no obliga al usuario a usar el peso sugerido, solo lo *recomienda*.

## 2. Principio fisiológico

La hipertrofia ocurre cuando el músculo recibe un estímulo (tensión mecánica) **ligeramente mayor** al que está acostumbrado. Esto se logra aplicando "Sobrecarga Progresiva" mediante:

- **Más peso** (carga).
- **Más repeticiones**.
- **Mejor técnica** y mayor Rango de Movimiento (ROM).

En esta aplicación se utilizará principalmente el modelo de **Doble Progresión** (progresión por repeticiones seguida de progresión por carga).

## 3. Datos necesarios

Para calcular la progresión, el sistema necesita guardar por cada serie:

| Dato                        | Descripción                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| Historial de sets           | Sets previos del ejercicio                                       |
| Peso utilizado              | Carga en kg de cada serie                                        |
| Repeticiones realizadas     | Reps completadas por serie                                       |
| RIR / RPE                   | Qué tan cerca del fallo llegó el usuario                         |
| Fecha del entrenamiento     | Cuándo se realizó la sesión                                      |
| Peso sugerido anterior      | Última sugerencia del sistema                                    |
| Incremento mínimo           | Incremento específico de ese ejercicio                           |

## 4. Objetivo de repeticiones (Doble Progresión)

Cada ejercicio tiene un **rango objetivo** (ej. 8–12 repeticiones). El algoritmo utiliza la "Doble Progresión":

1. El usuario **mantiene el peso** y busca aumentar las repeticiones sesión a sesión hasta alcanzar el **tope del rango** (12 reps) en todas las series.
2. Una vez alcanzado el tope, el sistema **aumenta el peso** y el usuario vuelve a intentar alcanzar el **inicio del rango** (8 reps) con la nueva carga.

## 5. Concepto de "sesión exitosa"

Una sesión se considera **exitosa** y apta para progresar la carga cuando:

- ✅ El usuario completa todas las series en el **tope del rango** de repeticiones.
- ✅ La técnica fue sólida (sin sacrificar ROM).
- ✅ El esfuerzo fue adecuado (ej. reporta un **RIR entre 1 y 2** en la última serie).

## 6. Regla básica de progresión

| Situación | Acción del sistema |
| --- | --- |
| Alcanza el tope del rango en **todas** las series | → Sugiere **aumentar peso** y reiniciar reps al mínimo del rango |
| Dentro del rango pero **no en el tope** | → Mantiene peso, sugiere sumar **1-2 reps** en la siguiente sesión |
| Peso demasiado ligero (RIR > 4) | → Puede sugerir un **aumento de peso anticipado** |

## 7. Ejemplo de progresión

Rango objetivo: 8-12 reps

| Sesión | Peso | Resultado | Observación | Sugerencia siguiente |
| --- | --- | --- | --- | --- |
| Entrenamiento 1 | 60 kg | 10, 9, 8 reps | Dentro del rango, no llega al tope | **60 kg** (sumar reps) |
| Entrenamiento 2 | 60 kg | 12, 12, 12 reps | ✅ Alcanza tope en todas las series | **62.5 kg** |
| Entrenamiento 3 | 62.5 kg | 9, 8, 8 reps | Vuelve al inicio del rango con nuevo peso | **62.5 kg** (sumar reps) |

## 8. Progresión por repeticiones

Integrada en los puntos 4 y 7. Es el **paso previo obligatorio** antes de subir de peso, asegurando que el músculo se ha adaptado completamente a la carga actual.

## 9. Manejo de fallos

Si el usuario falla en alcanzar el **mínimo del rango** de repeticiones (ej. objetivo 8-12, y hace 10, 6, 5):

- El sistema interpreta que la carga es **demasiado alta** o hay **fatiga acumulada**.
- **Opciones del sistema:**
  - Mantener el peso (si fue un mal día aislado).
  - Sugerir una ligera **reducción de peso** para volver a entrar en el rango objetivo.

## 10. Progresión específica por ejercicio

No todos los ejercicios progresan a la misma velocidad. El sistema guarda un **incremento mínimo** por tipo de movimiento:

| Tipo de ejercicio | Ejemplo | Incremento |
| --- | --- | --- |
| **Aislamiento** | Curl de bíceps, Elevaciones laterales | 0.5 kg – 1 kg |
| **Compuesto** | Sentadilla, Peso muerto | 2.5 kg – 5 kg |

> **Nota:** En ejercicios de aislamiento, saltos de 2 kg representan un porcentaje enorme de la carga total, por lo que se prioriza la progresión por repeticiones.

## 11. Manejo de ejercicios con peso corporal

Para ejercicios como dominadas o flexiones, donde no se puede sumar peso externo fácilmente, la progresión se calcula con:

- **Más repeticiones.**
- **Menos tiempo de descanso** entre series.
- **Pausas isométricas** (ej. pausa de 2 segundos abajo en la flexión) para aumentar la intensidad técnica.

## 12. Manejo de sets incompletos

Si el usuario omite un set, no termina el ejercicio, o lo marca como saltado:

> El sistema **ignora ese entrenamiento** para los cálculos de progresión de esa semana, evitando sugerencias de peso incorrectas.

## 13. Evitar progresión demasiado rápida

El sistema **nunca** debe:

- Aumentar peso más de una vez por sesión.
- Saltarse la fase de "ganar repeticiones" de la Doble Progresión.

Esto evita fatiga excesiva, estancamientos prematuros y lesiones.

## 14. Memoria del rendimiento reciente

El algoritmo utiliza el **historial de las últimas sesiones** del ejercicio para trazar la tendencia, permitiendo detectar:

- 📈 Mejoras reales
- ➡️ Estancamientos
- 📉 Retrocesos

## 15. Estancamiento y Auto-Deload (Descarga)

Si el usuario no logra añadir ni una sola repetición o subir de peso durante **2-3 sesiones consecutivas** (ej. se queda atascado en 60kg a 10, 9, 8 reps):

1. El sistema detecta **estancamiento por fatiga acumulada**.
2. **Acción:** Activa un *Deload automático*, sugiriendo:
   - Reducir el peso un **10-20%**, o
   - Reducir las series a la **mitad** durante esa semana.

Esto permite disipar la fatiga antes de retomar la progresión normal.

## 16. Personalización futura (Fuera del MVP)

En versiones avanzadas, el algoritmo podrá cruzar datos con:

- Peso corporal del usuario
- Calidad del sueño
- Volumen total semanal
- Distribución de fatiga por grupo muscular

## 17. Cálculo del peso sugerido

El peso sugerido se procesa al cargar la rutina del día.

**Proceso interno:**

```text
1. Buscar el último entrenamiento válido de ese ejercicio
2. Analizar las repeticiones logradas vs. el rango objetivo
3. Evaluar el RIR (esfuerzo)
4. Verificar si hubo estancamiento (últimas 3 sesiones)
5. Aplicar la regla de Doble Progresión o Auto-Deload
6. Retornar: Peso y Repeticiones objetivo sugeridas
```

## 18. Presentación al usuario

En la interfaz (GUI), el sistema muestra la comparativa clara:

| Campo                  | Valor                   |
| ---------------------- | ----------------------- |
| Rendimiento Anterior   | 80 kg × 12, 12, 12 reps |
| Objetivo Sugerido      | **82.5 kg × 8 reps**    |

> El usuario siempre tiene la opción de **sobrescribir** este dato manualmente si decide levantar algo distinto.

## 19. Adaptabilidad

El algoritmo es una **guía**. Si el usuario modifica el peso o las repeticiones sugeridas y guarda el entrenamiento, el sistema toma esos **nuevos datos reales** como la base para calcular la siguiente sesión.

## 20. Conclusión

> El algoritmo se basa en **maximizar la tensión mecánica** de forma segura mediante la **Doble Progresión**: si el usuario domina la carga actual llegando al límite superior de repeticiones con buena técnica, se aumenta el peso. Si se estanca repetidamente, se programa una descarga. Esto asegura un progreso **constante, inteligente y adaptado a la fisiología real**.

CALENTAMIENTO INTELIGENTE

## 1. Jerarquía Muscular

Cada ejercicio tiene músculos **primarios** (motores principales) y **secundarios** (sinergistas). Esto permite al sistema rastrear qué músculos ya están activados durante la sesión.

**Ejemplo - Press de Banca:**

- Primarios: `chest`
- Secundarios: `triceps`, `shoulders`

## 2. Estado de Activación Muscular (SessionContext)

El sistema rastrea el estado de cada músculo durante la sesión:

| Estado             | Descripción                                   | Resultado                 |
| ------------------ | --------------------------------------------- | ------------------------- |
| **Caliente (Hot)** | Trabajado como primario                       | No necesita calentamiento |
| **Tibio (Warm)**   | Trabajado como secundario (~50% activación)   | Calentamiento abreviado   |
| **Frío (Cold)**    | No trabajado aún                              | Calentamiento completo    |

**Reglas de transición:**

- Primary → **Hot** (siempre sobrescribe)
- Secondary → **Warm** (solo sube de Cold, nunca baja de Hot)
- Default → **Cold**

Para ejercicios compuestos, se usa el estado del músculo **más frío** entre todos los primarios.

## 3. Estilos de Calentamiento

El usuario elige el estilo antes de cada ejercicio:

### Standard (Hipertrofia)

Enfoque: lubricación articular y flujo sanguíneo (8-12 reps).

### Heavy (Fuerza/Powerlifting)

Enfoque: singles bajos para preparar el SNC sin fatiga metabólica.

### RAMP (Activación Dinámica)

Enfoque: incluye fase de movilidad específica antes de las series con peso.

## 4. Protocolo de Calentamiento: Estilo × Estado

| Estilo       | Frío (Completo)            | Tibio (Abreviado)     | Caliente (Contacto)   |
| ------------ | -------------------------- | --------------------- | --------------------- |
| **Standard** | 40%×12, 60%×8, 80%×3       | 60%×8, 80%×3          | 70%×5                 |
| **Heavy**    | 40%×8, 60%×4, 80%×2, 90%×1 | 70%×3, 85%×1          | 80%×1                 |
| **RAMP**     | Movilidad + 50%×10, 70%×5  | 60%×6                 | (sin series)          |

## 5. Algoritmo paso a paso

```text
Paso A — Clasificar ejercicio: obtener primaryMuscles[] y secondaryMuscles[]
Paso B — Evaluar estado muscular: SessionContext.getColdestState(primaryMuscles)
Paso C — Decidir protocolo según tabla Estilo × Estado
Paso D — Generar series con pesos redondeados al weightIncrement del ejercicio
Paso E — Actualizar SessionContext: primarios → Hot, secundarios → Warm
Paso F — Generar mensaje de recomendación al usuario
```

## 6. Reglas especiales

- **Peso >150kg (estilo Heavy):** Se agrega un paso extra de 95%×1 ("Potenciación") para evitar saltos bruscos.
- **Peso objetivo = 0:** No se generan series de calentamiento.
- **No al fallo:** Las series de calentamiento siempre son sub-máximas.
- **Descansos cortos:** 45-60s entre series de calentamiento, 90-120s solo antes de la primera serie efectiva.

## 7. Notificaciones inteligentes

El sistema genera mensajes basados en el estado muscular:

- Frío: *"Tu chest está frío. Realiza 3 series de calentamiento antes de Bench Press."*
- Tibio: *"Tu chest está tibio (trabajado como secundario). Realiza 2 series rápidas de aproximación."*
- Caliente: *"Tu chest ya está caliente. Puedes ir directo a tus series efectivas."*

## 8. Ejercicios Corregidos (Migración 022)

Los siguientes ejercicios fueron corregidos con músculos primarios correctos, músculos secundarios, y clasificación compound/isolation:

### Ejercicios que tenían 'other' como músculo (ahora corregidos)

| Ejercicio                   | Primarios                | Secundarios                     | Tipo      |
|-----------------------------|--------------------------|---------------------------------|-----------|
| 2 Handed Kettlebell Swing   | glutes, hamstrings       | back, shoulders, abs            | compound  |
| Arnold Shoulder Press       | shoulders                | triceps                         | compound  |
| Axe Hold                    | forearms                 | —                               | isolation |
| Barbell Hack Squats         | quadriceps, glutes       | hamstrings, calves              | compound  |
| Barbell Reverse Wrist Curl  | forearms                 | —                               | isolation |
| Bent-over Lateral Raises    | shoulders                | traps, back                     | isolation |
| Body-Ups                    | chest, triceps           | shoulders                       | compound  |
| Burpees                     | quadriceps, chest        | shoulders, triceps, abs, glutes | compound  |
| Chin Up                     | back, biceps             | forearms, abs                   | compound  |
| Ball crunches               | abs                      | —                               | isolation |
| Deadbug                     | abs                      | glutes                          | isolation |
| Deadhang                    | forearms, back           | shoulders                       | compound  |
| Deficit Deadlift            | back, hamstrings, glutes | quadriceps, traps, forearms     | compound  |
| Diagonal Shoulder Press     | shoulders                | triceps                         | compound  |
| Hand Grip                   | forearms                 | —                               | isolation |
| Hip Raise, Lying            | glutes, hamstrings       | abs                             | compound  |

### Ejercicios con músculos mejorados (ya tenían primario correcto)

| Ejercicio           | Primarios                | Secundarios                  | Tipo      |
|---------------------|--------------------------|------------------------------|-----------|
| Bench Press         | chest                    | triceps, shoulders           | compound  |
| Incline Bench Press | chest, shoulders         | triceps                      | compound  |
| Deadlift            | back, hamstrings, glutes | quadriceps, traps, forearms  | compound  |
| Squat               | quadriceps, glutes       | hamstrings, abs, back        | compound  |
| Barbell Squat       | quadriceps, glutes       | hamstrings, abs, back        | compound  |
| Front Squat         | quadriceps               | glutes, abs, back            | compound  |
| Overhead Press      | shoulders                | triceps, traps, abs          | compound  |
| Barbell Row         | back                     | biceps, traps, forearms      | compound  |
| Bent Over Row       | back                     | biceps, traps                | compound  |
| Pull Up             | back, biceps             | forearms, abs                | compound  |
| Romanian Deadlift   | hamstrings, glutes       | back                         | compound  |
| Leg Press           | quadriceps, glutes       | hamstrings                   | compound  |
| Dips                | chest, triceps           | shoulders                    | compound  |
| Lunges              | quadriceps, glutes       | hamstrings, calves           | compound  |
| Hip Thrust          | glutes                   | hamstrings, quadriceps       | compound  |
| Lat Pulldown        | back                     | biceps, forearms             | compound  |
| Cable Row           | back                     | biceps, traps                | compound  |
| Push Up             | chest, triceps           | shoulders, abs               | compound  |
| Face Pull           | shoulders, traps         | back                         | compound  |



## 9. Ejercicios Corregidos (Migración 023)

### Ejercicios que tenían 'other' como músculo (corregidos en 023)

| Ejercicio                            | Primarios                | Secundarios                  | Tipo      |
|--------------------------------------|--------------------------|------------------------------|-----------|
| Jogging                              | quadriceps, hamstrings   | calves, glutes, abs          | compound  |
| Run                                  | quadriceps, hamstrings   | calves, glutes               | compound  |
| Run - Treadmill                      | quadriceps, hamstrings   | calves, glutes               | compound  |
| Run - Interval Training              | quadriceps, hamstrings   | calves, glutes, abs          | compound  |
| Overhead Squat                       | quadriceps, glutes       | shoulders, abs, back         | compound  |
| Speed Deadlift                       | back, hamstrings, glutes | quadriceps, traps, forearms  | compound  |
| V-Bar Pulldown                       | back                     | biceps, forearms             | compound  |
| Rear Delt Raises                     | shoulders                | traps, back                  | isolation |
| Reverse Plank                        | abs, glutes              | shoulders, back              | compound  |
| Roman Chair                          | abs                      | —                            | isolation |
| Weighted Step-ups                    | quadriceps, glutes       | hamstrings, calves           | compound  |
| L Hold                               | abs                      | forearms, shoulders          | isolation |
| Dumbbell Push-Up                     | chest, triceps           | shoulders                    | compound  |
| Barbell Lunges Walking               | quadriceps, glutes       | hamstrings, calves           | compound  |
| One Arm Triceps Ext. Cable           | triceps                  | —                            | isolation |
| Rowing with TRX band                 | back                     | biceps, abs                  | compound  |
| Side-lying External Rotation         | shoulders                | —                            | isolation |
| Lying Rotator Cuff Exercise          | shoulders                | —                            | isolation |
| Standing Rope Forearm                | forearms                 | —                            | isolation |
| Stationary Bike                      | quadriceps, hamstrings   | calves, glutes               | compound  |
| Front Wood Chop                      | abs                      | shoulders, back              | compound  |
| Press militar                        | shoulders                | triceps, traps               | compound  |
| Zone 2 Running                       | quadriceps, hamstrings   | calves, glutes               | compound  |
| Incline Dumbbell Row                 | back                     | biceps, traps                | compound  |
| Flexión a pino contra la pared       | shoulders                | triceps, chest, traps        | compound  |

### Ejercicios con músculos mejorados (ya tenían primario correcto)

| Ejercicio                    | Primarios                | Secundarios              | Tipo      |
|------------------------------|--------------------------|--------------------------|-----------|
| Benchpress Dumbbells         | chest                    | shoulders, triceps       | compound  |
| Decline Bench Press Barbell  | chest                    | triceps, shoulders       | compound  |
| Decline Bench Press Dumbbell | chest                    | triceps, shoulders       | compound  |
| Fly With Dumbbells           | chest                    | shoulders                | isolation |
| Incline Dumbbell Fly         | chest                    | shoulders                | isolation |
| Good Mornings                | hamstrings, back         | glutes                   | compound  |
| Stiff-legged Deadlifts       | hamstrings, glutes       | back                     | compound  |
| Nordic Curl                  | hamstrings               | glutes                   | isolation |
| Reverse Nordic Curl          | quadriceps               | glutes, abs              | isolation |
| Glute Bridge                 | glutes                   | hamstrings, abs          | compound  |
| Hanging Leg Raises           | abs                      | forearms                 | isolation |
| Sumo Deadlift                | quadriceps, glutes       | hamstrings, back, traps  | compound  |
| Hammercurls                  | biceps                   | forearms                 | isolation |
| Lateral Raises               | shoulders                | —                        | isolation |
| Hyperextensions              | back, glutes             | hamstrings               | compound  |

## 10. Ejercicios Corregidos (Migración 024)

### 10.1 Ejercicios con músculo primario corregido

| Ejercicio                         | Primarios                  | Secundarios                  | Tipo      |
|-----------------------------------|----------------------------|------------------------------|-----------|
| Barbell Wrist Curl                | forearms                   | —                            | isolation |
| Handstand Pushup                  | shoulders                  | triceps, traps               | compound  |
| Front Squats                      | quadriceps                 | glutes, abs, back            | compound  |

### Ejercicios con secundarios y/o exercise_type agregados

| Ejercicio                         | Primarios                  | Secundarios                  | Tipo      |
|-----------------------------------|----------------------------|------------------------------|-----------|
| Barbell Ab Rollout                | abs                        | shoulders, back              | compound  |
| Bench Press Narrow Grip           | triceps, chest             | shoulders                    | compound  |
| Bent High Pulls                   | traps                      | shoulders, back              | compound  |
| Braced Squat                      | quadriceps                 | glutes, abs                  | compound  |
| Chest Press                       | chest                      | triceps, shoulders           | compound  |
| Butterfly                         | chest                      | shoulders                    | isolation |
| Butterfly Reverse                 | shoulders                  | traps, back                  | isolation |
| Cable External Rotation           | shoulders                  | —                            | isolation |
| Cable Woodchoppers                | abs                        | shoulders                    | compound  |
| Calf Press Using Leg Press Machine| calves                     | —                            | isolation |
| Decline Pushups                   | chest                      | shoulders, triceps           | compound  |
| Diamond push ups                  | triceps, chest             | shoulders                    | compound  |
| Dumbbell Goblet Squat             | quadriceps, glutes         | abs, hamstrings              | compound  |
| Dumbbell Lunges Standing          | quadriceps, glutes         | hamstrings, calves           | compound  |
| Dumbbell Lunges Walking           | quadriceps, glutes         | hamstrings, calves           | compound  |
| Dumbbell Triceps Extension        | triceps                    | shoulders                    | isolation |
| Flutter Kicks                     | abs                        | quadriceps                   | isolation |
| Fly With Cable                    | chest                      | shoulders                    | isolation |
| Hollow Hold                       | abs                        | —                            | isolation |
| Incline Push up                   | chest                      | triceps, shoulders           | compound  |
| Barbell Lunges Standing           | quadriceps, glutes         | hamstrings, calves           | compound  |
| Cable Cross-over                  | chest                      | shoulders                    | isolation |
| Landmine press                    | shoulders                  | chest, triceps               | compound  |
| Leg Curls (laying)                | hamstrings                 | calves                       | isolation |
| Leg Curls (sitting)               | hamstrings                 | —                            | isolation |
| Leg Curls (standing)              | hamstrings                 | —                            | isolation |
| Pendelay Rows                     | back                       | biceps, traps                | compound  |
| Shoulder Shrug                    | traps                      | shoulders                    | isolation |
| Sumo Squats                       | glutes, quadriceps         | hamstrings, abs              | compound  |
| Superman                          | back, glutes               | hamstrings, shoulders        | compound  |
| Thruster                          | shoulders, quadriceps      | traps, glutes, triceps       | compound  |
| Ring Dips                         | triceps, chest             | shoulders                    | compound  |
| Renegade Row                      | back                       | biceps, abs, chest           | compound  |
| Preacher Curls                    | biceps                     | forearms                     | isolation |
| Single Leg Extension              | quadriceps                 | —                            | isolation |
| Standing Calf Raises              | calves                     | —                            | isolation |
| Sitting Calf Raises               | calves                     | —                            | isolation |

## 11. Ejercicios Corregidos (Migración 025)

### 11.1 Ejercicios con músculo primario corregido

| Ejercicio                         | Primarios                  | Secundarios                  | Tipo      |
|-----------------------------------|----------------------------|------------------------------|-----------|
| Prensa de piernas                 | quadriceps, glutes         | hamstrings, calves           | compound  |
| Cross-Bench Dumbbell Pullovers    | chest, back                | triceps, shoulders           | compound  |

### Variaciones de Curl / Bíceps

| Ejercicio                         | Primarios                  | Secundarios                  | Tipo      |
|-----------------------------------|----------------------------|------------------------------|-----------|
| Biceps Curls With Barbell         | biceps                     | forearms                     | isolation |
| Curl de bíceps con mancuerna      | biceps                     | forearms                     | isolation |
| Curl de biceps con barra Z        | biceps                     | forearms                     | isolation |
| Biceps Curl With Cable            | biceps                     | forearms                     | isolation |
| Dumbbell Concentration Curl       | biceps                     | forearms                     | isolation |
| Dumbbell Incline Curl             | biceps                     | forearms                     | isolation |
| Dumbbells on Scott Machine        | biceps                     | forearms                     | isolation |
| Hammercurls on Cable              | biceps                     | forearms                     | isolation |
| Standing Bicep Curl               | biceps                     | forearms                     | isolation |
| Reverse Bar Curl                  | forearms, biceps           | —                            | isolation |
| Reverse Curl                      | forearms, biceps           | —                            | isolation |
| Overhand Cable Curl               | biceps                     | forearms                     | isolation |

### Variaciones de Crunches / Abdominales

| Ejercicio                         | Primarios                  | Secundarios                  | Tipo      |
|-----------------------------------|----------------------------|------------------------------|-----------|
| Abdominales                       | abs                        | —                            | isolation |
| Abdominal Stabilization           | abs                        | —                            | isolation |
| Crunches on incline bench         | abs                        | —                            | isolation |
| Crunches on Machine               | abs                        | —                            | isolation |
| Crunches With Cable               | abs                        | —                            | isolation |
| Crunches With Legs Up             | abs                        | —                            | isolation |
| Negative Crunches                 | abs                        | —                            | isolation |
| Levantamiento de piernas          | abs                        | —                            | isolation |
| Scissors                          | abs                        | hamstrings                   | isolation |
| Splinter Sit-ups                  | abs                        | —                            | compound  |

### Variaciones de Pulldown / Espalda

| Ejercicio                         | Primarios                  | Secundarios                  | Tipo      |
|-----------------------------------|----------------------------|------------------------------|-----------|
| Dominadas Supinas                 | back, biceps               | forearms                     | compound  |
| Close-grip Lat Pull Down          | back                       | biceps, forearms             | compound  |
| Lat Pull Down (Leaning Back)      | back                       | biceps, forearms             | compound  |
| Lat Pull Down (Straight Back)     | back                       | biceps, forearms             | compound  |
| Underhand Lat Pull Down           | back                       | biceps, forearms             | compound  |
| Wide-grip Pulldown                | back                       | biceps, forearms             | compound  |

### Piernas / Glúteos / Hombros

| Ejercicio                         | Primarios                  | Secundarios                  | Tipo      |
|-----------------------------------|----------------------------|------------------------------|-----------|
| Seated Hip Adduction              | glutes                     | —                            | isolation |
| Curl femoral                      | hamstrings                 | —                            | isolation |
| Curl cuadriceps                   | quadriceps                 | —                            | isolation |
| Prensa de piernas cerrada         | quadriceps                 | glutes                       | compound  |
| Press de piernas abierto          | quadriceps                 | glutes, hamstrings           | compound  |
| Hindu Squats                      | quadriceps                 | glutes, calves               | compound  |
| Squats on Multipress              | quadriceps                 | glutes, hamstrings           | compound  |
| Kettlebell Swings                 | glutes, hamstrings         | back, shoulders, abs         | compound  |
| Front Raises with Plates          | shoulders                  | —                            | isolation |
| Elevaciones frontales             | shoulders                  | —                            | isolation |
| Bear Walk                         | shoulders, chest           | glutes, back, abs, traps     | compound  |
