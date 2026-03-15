Aquí tienes el texto completo reescrito e integrado con las correcciones basadas en ciencia y las metodologías de sobrecarga progresiva. Está estructurado para que te sirva directamente como documentación lógica para tu algoritmo.

Funcionamiento del Algoritmo de Sobrecarga Progresiva
Aplicación de Rutinas de Gimnasio (MVP)

1. Objetivo del algoritmo
El algoritmo de sobrecarga progresiva tiene como objetivo maximizar la tensión mecánica estimulando el progreso muscular, manteniendo la fatiga bajo control y priorizando la técnica.
El sistema debe:

Sugerir el peso y las repeticiones para el siguiente entrenamiento.

Adaptarse al rendimiento real del usuario (basado en repeticiones y esfuerzo percibido).

Evitar aumentos excesivos que comprometan la técnica o causen lesiones.

Mantener una progresión constante.
El algoritmo no obliga al usuario a usar el peso sugerido, solo lo recomienda.

2. Principio fisiológico
La hipertrofia ocurre cuando el músculo recibe un estímulo (tensión mecánica) ligeramente mayor al que está acostumbrado.
Esto se logra aplicando "Sobrecarga Progresiva" mediante:

Más peso (carga).

Más repeticiones.

Mejor técnica y mayor Rango de Movimiento (ROM).
En esta aplicación se utilizará principalmente el modelo de Doble Progresión (progresión por repeticiones seguida de progresión por carga).

3. Datos necesarios
Para calcular la progresión, el sistema necesita guardar por cada serie:

Historial de sets del ejercicio.

Peso utilizado.

Repeticiones realizadas.

RIR (Repeticiones en recámara) o RPE (Esfuerzo percibido): Qué tan cerca del fallo llegó el usuario.

Fecha del entrenamiento.

Peso sugerido anterior.

Incremento mínimo específico de ese ejercicio.

4. Objetivo de repeticiones (Doble Progresión)
Cada ejercicio tiene un rango objetivo (ej. 8–12 repeticiones).
El algoritmo utiliza la "Doble Progresión":

El usuario mantiene el peso y busca aumentar las repeticiones sesión a sesión hasta alcanzar el tope del rango (12 reps) en todas las series.

Una vez alcanzado el tope, el sistema aumenta el peso y el usuario vuelve a intentar alcanzar el inicio del rango (8 reps) con la nueva carga.

5. Concepto de “sesión exitosa”
Una sesión se considera exitosa y apta para progresar la carga cuando:

El usuario completa todas las series en el tope del rango de repeticiones.

La técnica fue sólida (sin sacrificar ROM).

El esfuerzo fue adecuado (ej. reporta un RIR entre 1 y 2 en la última serie).

6. Regla básica de progresión

Si el usuario alcanza el tope del rango de repeticiones en todas las series: → El sistema sugiere aumentar el peso en el siguiente entrenamiento y reiniciar las repeticiones al mínimo del rango.

Si el usuario está dentro del rango pero no en el tope: → El peso se mantiene y el sistema sugiere intentar sumar 1 o 2 repeticiones más en la siguiente sesión.

Si el usuario percibe el peso demasiado ligero (ej. RIR > 4): → El sistema puede sugerir un aumento de peso anticipado.

7. Ejemplo de progresión (Rango objetivo: 8-12 reps)

Entrenamiento 1

Peso: 60 kg

Resultado: 10, 9, 8 reps. (Dentro del rango, no llega al tope).

Siguiente sesión: Peso sugerido → 60 kg (Objetivo: sumar repeticiones).

Entrenamiento 2

Peso: 60 kg

Resultado: 12, 12, 12 reps. (Alcanza el tope en todas las series).

Siguiente sesión: Peso sugerido → 62.5 kg.

Entrenamiento 3

Peso: 62.5 kg

Resultado: 9, 8, 8 reps. (Vuelve al inicio del rango con el nuevo peso).

Siguiente sesión: Peso sugerido → 62.5 kg.

8. Progresión por repeticiones
Integrada en el punto 4 y 7. Es el paso previo obligatorio antes de subir de peso, asegurando que el músculo se ha adaptado completamente a la carga actual.

9. Manejo de fallos
Si el usuario falla en alcanzar el mínimo del rango de repeticiones (ej. objetivo 8-12, y hace 10, 6, 5):
El sistema interpreta que la carga es demasiado alta o hay fatiga acumulada.

Opciones del sistema: Mantener el peso (si fue un mal día aislado) o sugerir una ligera reducción de peso para volver a entrar en el rango objetivo.

10. Progresión específica por ejercicio
No todos los ejercicios progresan a la misma velocidad. El sistema guarda un incremento mínimo por tipo de movimiento:

Ejercicios de Aislamiento (Curl de bíceps, Elevaciones laterales): Incrementos micro (0.5 kg a 1 kg) o progresión prioritaria por repeticiones, ya que saltos de 2 kg representan un porcentaje enorme de la carga total.

Ejercicios Compuestos (Sentadilla, Peso muerto): Incrementos estándar (2.5 kg a 5 kg).

11. Manejo de ejercicios con peso corporal
Para ejercicios como dominadas o flexiones, donde no se puede sumar peso externo fácilmente, la progresión se calcula con:

Más repeticiones.

Menos tiempo de descanso entre series.

Pausas isométricas (ej. pausa de 2 segundos abajo en la flexión) para aumentar la intensidad técnica.

12. Manejo de sets incompletos
Si el usuario omite un set, no termina el ejercicio, o lo marca como saltado:
El sistema ignora ese entrenamiento para los cálculos de progresión de esa semana, evitando sugerencias de peso incorrectas.

13. Evitar progresión demasiado rápida
El sistema nunca debe aumentar peso más de una vez por sesión ni saltarse la fase de "ganar repeticiones" de la Doble Progresión. Esto evita fatiga excesiva, estancamientos prematuros y lesiones.

14. Memoria del rendimiento reciente
El algoritmo utiliza el historial de las últimas sesiones del ejercicio para trazar la tendencia, permitiendo detectar mejoras reales, estancamientos o retrocesos.

15. Estancamiento y Auto-Deload (Descarga)
Si el usuario no logra añadir ni una sola repetición o subir de peso durante 2 o 3 sesiones consecutivas (ej. se queda atascado en 60kg a 10, 9, 8 reps):

El sistema detecta estancamiento por fatiga acumulada.

Acción: Activa un Deload automático, sugiriendo reducir el peso un 10-20% o reducir las series a la mitad durante esa semana para disipar la fatiga, antes de retomar la progresión normal.

16. Personalización futura (Fuera del MVP)
En versiones avanzadas, el algoritmo podrá cruzar datos con: peso corporal del usuario, calidad del sueño, volumen total semanal y distribución de fatiga por grupo muscular.

17. Cálculo del peso sugerido
El peso sugerido se procesa al cargar la rutina del día.
Proceso interno:

Buscar el último entrenamiento válido de ese ejercicio.

Analizar las repeticiones logradas vs. el rango objetivo.

Evaluar el RIR (esfuerzo).

Verificar si hubo estancamiento (últimas 3 sesiones).

Aplicar la regla de Doble Progresión o Auto-Deload.

Retornar: Peso y Repeticiones objetivo sugeridas.

18. Presentación al usuario
En la interfaz (GUI), el sistema muestra la comparativa clara:

Rendimiento Anterior: 80 kg x 12, 12, 12 reps.

Objetivo Sugerido: 82.5 kg x 8 reps.
El usuario siempre tiene la opción de sobrescribir este dato manualmente si decide levantar algo distinto.

19. Adaptabilidad
El algoritmo es una guía. Si el usuario modifica el peso o las repeticiones sugeridas y guarda el entrenamiento, el sistema toma esos nuevos datos reales como la base base para calcular la siguiente sesión.

20. Conclusión
El algoritmo se basa en maximizar la tensión mecánica de forma segura mediante la Doble Progresión: si el usuario domina la carga actual llegando al límite superior de repeticiones con buena técnica, se aumenta el peso. Si se estanca repetidamente, se programa una descarga. Esto asegura un progreso constante, inteligente y adaptado a la fisiología real.