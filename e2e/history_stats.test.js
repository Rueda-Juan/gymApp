describe("Historial y Estadísticas", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // 🔹 Helpers
  async function navigateToHistory() {
    await element(by.id("tab-routines")).tap();
    await element(by.id("tab-history")).tap();
  }

  async function navigateToStats() {
    await element(by.id("tab-progress")).tap();
  }

  async function createFinishedWorkout() {
    await element(by.id("start-free-workout-button")).tap();
    await element(by.id("set-check-0")).tap();
    await element(by.id("finish-workout-button")).tap();
    await element(by.id("confirm-finish-workout")).tap();
    await element(by.id("dismiss-summary-button")).tap();
  }

  // 🧪 Tests

  it("visualiza historial con entrenamientos existentes", async () => {
    await createFinishedWorkout(); // o usar seed

    await navigateToHistory();

    await expect(element(by.id("history-list"))).toBeVisible();
    await expect(element(by.id("history-item")).atIndex(0)).toBeVisible();
  });

  it("visualiza estado vacío del historial", async () => {
    await navigateToHistory();

    await expect(element(by.id("empty-history-state"))).toBeVisible();
  });

  it("navega a la pantalla de estadísticas", async () => {
    await navigateToStats();

    await expect(element(by.id("stats-screen"))).toBeVisible();
  });

  it("cambia el ejercicio en estadísticas", async () => {
    await navigateToStats();

    await element(by.id("exercise-picker")).tap();
    await element(by.id("exercise-option-press-banca")).tap();

    await expect(element(by.id("selected-exercise-title"))).toHaveText(
      "Press de Banca",
    );
  });

  it("abre el detalle de un entrenamiento desde el historial", async () => {
    await createFinishedWorkout();
    await navigateToHistory();

    await element(by.id("history-item")).atIndex(0).tap();
    await expect(element(by.id("workout-detail-screen"))).toBeVisible();
  });

  it("visualiza el historial completo de entrenamientos", async () => {
    await createFinishedWorkout();
    await navigateToHistory();

    await element(by.id("view-full-history-button")).tap();
    await expect(element(by.id("full-history-screen"))).toBeVisible();
  });

  it("visualiza el mapa de calor de actividad", async () => {
    await navigateToHistory();
    // Assuming heat map is in the history or profile screen
    await expect(element(by.id("activity-heatmap"))).toBeVisible();
  });

  it("registra un nuevo peso corporal", async () => {
    await navigateToStats();

    await element(by.id("log-weight-button")).tap();
    await element(by.id("weight-input")).typeText("75.5");
    await element(by.id("save-weight-button")).tap();

    await expect(element(by.id("current-weight-display"))).toHaveText(
      "75.5 kg",
    );
  });
});
