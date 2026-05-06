describe("Onboarding", () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("completa el onboarding con datos válidos", async () => {
    await expect(element(by.id("onboarding-screen"))).toBeVisible();

    await element(by.id("onboarding-name-input")).typeText("Test User");
    await element(by.id("onboarding-age-input")).typeText("25");
    await element(by.id("gender-option-male")).tap();

    await element(by.id("onboarding-submit-button")).tap();

    await expect(element(by.id("home-screen"))).toBeVisible();
    await expect(element(by.id("welcome-message"))).toHaveText(
      "Hola, Test User",
    );
  });

  it("valida errores en onboarding incompleto", async () => {
    await element(by.id("onboarding-submit-button")).tap();

    await expect(element(by.id("error-name-required"))).toBeVisible();
    await expect(element(by.id("error-age-required"))).toBeVisible();
  });

  describe("Configuración y Ajustes", () => {
    beforeEach(async () => {
      // Asume que ya pasamos el onboarding y navegamos a Settings
      await element(by.id("tab-profile")).tap();
      await element(by.id("settings-button")).tap();
    });

    it("cambia la configuración de notificaciones", async () => {
      await element(by.id("notifications-toggle")).tap();
      // Validar visualmente que cambió de estado (switch)
      await expect(element(by.id("notifications-toggle"))).toHaveToggleValue(
        true,
      );
    });

    it("cambia el tema de la aplicación", async () => {
      await element(by.id("theme-picker-button")).tap();
      await element(by.id("theme-option-dark")).tap();

      // Asumiendo que podemos verificar una propiedad de estilo o un texto guardado
      await expect(element(by.id("current-theme-label"))).toHaveText("Oscuro");
    });

    it("modifica la privacidad de la cuenta", async () => {
      await element(by.id("privacy-toggle")).tap();
      await expect(element(by.id("privacy-toggle"))).toHaveToggleValue(true);
    });
  });
});
