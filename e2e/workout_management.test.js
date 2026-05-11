describe("Gestión del Entrenamiento", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
    await device.disableSynchronization();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // 🔹 Helpers

  async function startFreeWorkout() {
    await element(by.id("start-free-workout-button")).tap();
    await expect(element(by.id("workout-screen"))).toBeVisible();
  }

  async function addExerciseToWorkout() {
    await element(by.id("workout-options-button")).tap();
    await element(by.id("add-exercise-option")).tap();
    await element(by.id("exercise-option-press-banca")).tap();
    await element(by.id("confirm-add-exercise")).tap();
  }

  async function finishWorkout() {
    await element(by.id("finish-workout-button")).tap();
    await element(by.id("confirm-finish-workout")).tap();
  }

  // 🧪 Tests atómicos

  it("inicia un entrenamiento libre", async () => {
    await startFreeWorkout();
  });

  it("agrega un ejercicio a un entrenamiento activo", async () => {
    await startFreeWorkout();

    await addExerciseToWorkout();

    await expect(
      element(by.id("workout-exercise-item")).atIndex(0),
    ).toBeVisible();
  });

  it("marca un set como completado", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout();

    await element(by.id("set-check-0")).tap();

    await expect(element(by.id("set-check-0"))).toHaveToggleValue(true);
  });

  it("agrega un nuevo set", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout();

    await element(by.id("add-set-button")).tap();

    await expect(element(by.id("set-item")).atIndex(1)).toBeVisible();
  });

  it("finaliza un entrenamiento correctamente", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout();

    await element(by.id("set-check-0")).tap();

    await finishWorkout();

    await expect(element(by.id("workout-complete-screen"))).toBeVisible();
  });

  it("cancela un entrenamiento activo", async () => {
    await startFreeWorkout();

    await element(by.id("cancel-workout-button")).tap();
    await element(by.id("confirm-cancel-workout")).tap();

    await expect(element(by.id("home-screen"))).toBeVisible();
  });

  // 🧪 Smoke test (flujo completo controlado)

  it("flujo completo de entrenamiento libre (smoke)", async () => {
    await startFreeWorkout();

    await addExerciseToWorkout();

    await element(by.id("set-check-0")).tap();
    await element(by.id("add-set-button")).tap();
    await element(by.id("set-check-1")).tap();

    await finishWorkout();

    await expect(element(by.id("workout-complete-screen"))).toBeVisible();
  });

  it("inicia un entrenamiento seleccionando una rutina existente", async () => {
    // Asumiendo que existe una rutina o la creamos antes
    await element(by.id("tab-routines")).tap();
    await element(by.id("add-routine-button")).tap();
    await element(by.id("routine-name-input")).typeText("Rutina para Iniciar");
    await element(by.id("save-routine-button")).tap();

    await element(by.text("Rutina para Iniciar")).tap();
    await element(by.id("start-routine-workout-button")).tap();

    await expect(element(by.id("workout-screen"))).toBeVisible();
  });

  it("marca un set como completado con tiempo", async () => {
    await startFreeWorkout();
    // Asumir que agregamos un ejercicio por tiempo (ej: plancha)
    await element(by.id("workout-options-button")).tap();
    await element(by.id("add-exercise-option")).tap();
    await element(by.id("exercise-option-plank")).tap();
    await element(by.id("confirm-add-exercise")).tap();

    await element(by.id("set-time-input-0")).replaceText("60");
    await element(by.id("set-check-0")).tap();

    await expect(element(by.id("set-check-0"))).toHaveToggleValue(true);
  });

  it("edita un set ya completado", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout();

    await element(by.id("set-check-0")).tap();
    await element(by.id("set-reps-input-0")).replaceText("12");
    await element(by.id("set-check-0")).tap(); // Desmarcar o confirmar cambio

    await expect(element(by.id("set-reps-input-0"))).toHaveText("12");
  });

  it("elimina un set existente", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout();

    await element(by.id("delete-set-button-0")).swipe("left"); // o tap()
    await expect(element(by.id("set-item"))).toHaveCount(0); // o -1 del original
  });

  it("abre y cierra el modal de descanso", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout();

    await element(by.id("rest-timer-button")).tap();
    await expect(element(by.id("rest-modal"))).toBeVisible();

    await element(by.id("close-rest-modal")).tap();
    await expect(element(by.id("rest-modal"))).not.toBeVisible();
  });

  it("abre y cierra el selector de peso (calculadora)", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout();

    await element(by.id("weight-calculator-button-0")).tap();
    await expect(element(by.id("weight-calculator-modal"))).toBeVisible();

    await element(by.id("close-calculator-modal")).tap();
    await expect(element(by.id("weight-calculator-modal"))).not.toBeVisible();
  });

  it("navega al siguiente y anterior ejercicio", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout(); // Ejercicio 1

    await element(by.id("workout-options-button")).tap();
    await element(by.id("add-exercise-option")).tap();
    await element(by.id("exercise-option-sentadilla")).tap();
    await element(by.id("confirm-add-exercise")).tap(); // Ejercicio 2

    // Asumiendo navegación por paginación o scroll horizontal
    await element(by.id("next-exercise-button")).tap();
    await expect(element(by.id("active-exercise-title"))).toHaveText(
      "Sentadilla",
    );

    await element(by.id("prev-exercise-button")).tap();
    await expect(element(by.id("active-exercise-title"))).toHaveText(
      "Press de Banca",
    );
  });

  it("agrega una nota a un entrenamiento activo", async () => {
    await startFreeWorkout();

    await element(by.id("workout-notes-button")).tap();
    await element(by.id("workout-notes-input")).typeText("Nota de prueba");
    await element(by.id("save-notes-button")).tap();

    await expect(element(by.id("workout-notes-indicator"))).toBeVisible();
  });

  it("cancela finalización y vuelve al entrenamiento", async () => {
    await startFreeWorkout();
    await addExerciseToWorkout();

    await element(by.id("finish-workout-button")).tap();
    await element(by.id("cancel-finish-workout")).tap();

    await expect(element(by.id("workout-screen"))).toBeVisible();
  });
});
