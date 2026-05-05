describe('Gestión de Ejercicios', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('tab-exercises')).tap();
  });

  // 🔹 Helpers
  async function createExercise(name) {
    await element(by.id('add-exercise-button')).tap();
    await element(by.id('exercise-name-input')).typeText(name);
    await element(by.id('save-exercise-button')).tap();
  }

  it('crea un ejercicio con datos mínimos válidos', async () => {
    await createExercise('Ejercicio A');
    await expect(element(by.text('Ejercicio A'))).toBeVisible();
  });

  it('valida error por nombre vacío', async () => {
    await element(by.id('add-exercise-button')).tap();
    await element(by.id('save-exercise-button')).tap();

    await expect(element(by.id('error-name-required'))).toBeVisible();
  });

  it('filtra ejercicios por grupo muscular', async () => {
    await createExercise('Ejercicio Pecho');

    await element(by.id('filter-muscle-pecho')).tap();

    await expect(element(by.text('Ejercicio Pecho'))).toBeVisible();
  });

  it('visualiza el detalle de un ejercicio', async () => {
    await createExercise('Ejercicio Detalle');

    await element(by.text('Ejercicio Detalle')).tap();

    await expect(element(by.id('exercise-detail-screen'))).toBeVisible();
  });

  it('edita el nombre de un ejercicio', async () => {
    await createExercise('Ejercicio Original');

    await element(by.text('Ejercicio Original')).tap();
    await element(by.id('exercise-name-input')).replaceText('Ejercicio Editado');
    await element(by.id('save-exercise-button')).tap();

    await expect(element(by.text('Ejercicio Editado'))).toBeVisible();
  });

  it('descarta cambios al salir sin guardar', async () => {
    await createExercise('Ejercicio Base');

    await element(by.text('Ejercicio Base')).tap();
    await element(by.id('exercise-name-input')).replaceText('Cambio no guardado');
    await element(by.id('close-header-button')).tap();

    await expect(element(by.text('Ejercicio Base'))).toBeVisible();
  });

  it('crea un ejercicio seleccionando un grupo muscular específico', async () => {
    await element(by.id('add-exercise-button')).tap();
    await element(by.id('exercise-name-input')).typeText('Ejercicio con Grupo');
    await element(by.id('muscle-group-picker')).tap();
    await element(by.id('muscle-option-back')).tap();
    await element(by.id('save-exercise-button')).tap();

    await expect(element(by.text('Ejercicio con Grupo'))).toBeVisible();
  });

  it('crea un ejercicio seleccionando tipo de equipo', async () => {
    await element(by.id('add-exercise-button')).tap();
    await element(by.id('exercise-name-input')).typeText('Ejercicio con Equipo');
    await element(by.id('equipment-picker')).tap();
    await element(by.id('equipment-option-dumbbell')).tap();
    await element(by.id('save-exercise-button')).tap();

    await expect(element(by.text('Ejercicio con Equipo'))).toBeVisible();
  });

  it('edita el grupo muscular de un ejercicio', async () => {
    await createExercise('Ejercicio Editar Grupo');

    await element(by.text('Ejercicio Editar Grupo')).tap();
    await element(by.id('muscle-group-picker')).tap();
    await element(by.id('muscle-option-legs')).tap();
    await element(by.id('save-exercise-button')).tap();

    await expect(element(by.text('Ejercicio Editar Grupo'))).toBeVisible();
  });

  it('elimina un ejercicio y confirma la acción', async () => {
    await createExercise('Ejercicio a Eliminar');

    await element(by.text('Ejercicio a Eliminar')).tap();
    await element(by.id('delete-exercise-button')).tap();
    await element(by.id('confirm-delete-exercise')).tap();

    await expect(element(by.text('Ejercicio a Eliminar'))).not.toExist();
  });

  it('cancela la eliminación de un ejercicio', async () => {
    await createExercise('Ejercicio Mantener');

    await element(by.text('Ejercicio Mantener')).tap();
    await element(by.id('delete-exercise-button')).tap();
    await element(by.id('cancel-delete-exercise')).tap();
    await element(by.id('close-header-button')).tap();

    await expect(element(by.text('Ejercicio Mantener'))).toBeVisible();
  });
});