describe('Gestión de Rutinas', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('tab-routines')).tap();
  });

  // 🔹 Helpers

  async function createRoutine(name) {
    await element(by.id('add-routine-button')).tap();
    await element(by.id('routine-name-input')).typeText(name);
    await element(by.id('save-routine-button')).tap();
  }

  async function openRoutine(name) {
    await element(by.text(name)).tap();
  }

  // 🧪 Tests

  it('crea una rutina con nombre válido', async () => {
    const name = `Rutina-${Date.now()}`;

    await createRoutine(name);

    await expect(element(by.text(name))).toBeVisible();
  });

  it('valida error al crear rutina sin nombre', async () => {
    await element(by.id('add-routine-button')).tap();
    await element(by.id('save-routine-button')).tap();

    await expect(element(by.id('error-routine-name-required'))).toBeVisible();
  });

  it('edita el nombre de una rutina', async () => {
    const name = `Rutina-${Date.now()}`;
    const updated = `${name}-editada`;

    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('routine-name-input')).replaceText(updated);
    await element(by.id('save-routine-button')).tap();

    await expect(element(by.text(updated))).toBeVisible();
  });

  it('agrega un ejercicio a una rutina', async () => {
    const name = `Rutina-${Date.now()}`;

    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-press-banca')).tap();
    await element(by.id('confirm-add-exercise')).tap();

    await expect(element(by.id('routine-exercise-item')).atIndex(0)).toBeVisible();
  });

  it('elimina un ejercicio de una rutina', async () => {
    const name = `Rutina-${Date.now()}`;

    await createRoutine(name);
    await openRoutine(name);

    // agregar primero
    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-press-banca')).tap();
    await element(by.id('confirm-add-exercise')).tap();

    // eliminar
    await element(by.id('remove-exercise-button')).atIndex(0).tap();

    await expect(element(by.id('routine-exercise-item'))).toHaveCount(0);
  });

  it('cancela la eliminación de una rutina', async () => {
    const name = `Rutina-${Date.now()}`;

    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('delete-routine-button')).tap();
    await element(by.id('cancel-delete-routine')).tap();

    await expect(element(by.text(name))).toBeVisible();
  });

  it('elimina una rutina confirmando', async () => {
    const name = `Rutina-${Date.now()}`;

    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('delete-routine-button')).tap();
    await element(by.id('confirm-delete-routine')).tap();

    await expect(element(by.text(name))).not.toExist();
  });

  it('reordena dos ejercicios dentro de una rutina', async () => {
    const name = `Rutina-Reorden-${Date.now()}`;
    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-press-banca')).tap();
    await element(by.id('confirm-add-exercise')).tap();

    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-sentadilla')).tap();
    await element(by.id('confirm-add-exercise')).tap();

    await element(by.id('move-up-button')).atIndex(1).tap();

    await expect(element(by.id('routine-exercise-item')).atIndex(0)).toBeVisible();
  });

  it('crea un superset entre dos ejercicios consecutivos', async () => {
    const name = `Rutina-Superset-${Date.now()}`;
    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-press-banca')).tap();
    await element(by.id('confirm-add-exercise')).tap();
    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-sentadilla')).tap();
    await element(by.id('confirm-add-exercise')).tap();

    await element(by.id('create-superset-button')).atIndex(0).tap();

    await expect(element(by.id('superset-indicator'))).toBeVisible();
  });

  it('deshace un superset existente', async () => {
    const name = `Rutina-Unsuperset-${Date.now()}`;
    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-press-banca')).tap();
    await element(by.id('confirm-add-exercise')).tap();
    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-sentadilla')).tap();
    await element(by.id('confirm-add-exercise')).tap();
    await element(by.id('create-superset-button')).atIndex(0).tap();

    await element(by.id('remove-superset-button')).atIndex(0).tap();

    await expect(element(by.id('superset-indicator'))).not.toExist();
  });

  it('modifica la cantidad de series de un ejercicio', async () => {
    const name = `Rutina-Series-${Date.now()}`;
    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-press-banca')).tap();
    await element(by.id('confirm-add-exercise')).tap();

    await element(by.id('increase-sets-button')).atIndex(0).tap();
    await expect(element(by.id('sets-count'))).toHaveText('4');
  });

  it('modifica el rango de repeticiones objetivo', async () => {
    const name = `Rutina-Reps-${Date.now()}`;
    await createRoutine(name);
    await openRoutine(name);

    await element(by.id('add-exercise-to-routine')).tap();
    await element(by.id('exercise-option-press-banca')).tap();
    await element(by.id('confirm-add-exercise')).tap();

    await element(by.id('target-reps-input')).atIndex(0).replaceText('8-12');
    await expect(element(by.id('target-reps-input')).atIndex(0)).toHaveText('8-12');
  });
});