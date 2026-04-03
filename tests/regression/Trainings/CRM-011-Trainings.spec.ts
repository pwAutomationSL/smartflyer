import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../../page-objects';
const TRAINING_NAME = 'New Training ' + uniqueId();
const TRAINING_NAME_UPDATE = 'New Training up' + uniqueId();
const shortDescription = `Lorem ipsum dolor sit amet consectetur adipiscing elit.`;
const shortDescription_update = `Lorem ipsum dolor sit amet consectetur adipiscing elit.`;
const date = `2026-08-08`;
const video = `www.youtube.com`;
test.use({
  launchOptions: { slowMo: 350 },
});
test.describe('CRM-011 Trainings', () => {
  test('As an admin, i want to create a new training', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    trainings,
  }) => {
    await test.step('Go to the Training tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Trainings');
    });
    await test.step('Add new Training', async () => {
      await page.waitForLoadState('load');
      await trainings.addTraining();
      await page.waitForLoadState('networkidle');
      await trainings.enterTitle(TRAINING_NAME);
      await trainings.uploadFile();
      await trainings.enterShortDescription(shortDescription);
      await trainings.selectPartner();
      await trainings.selectCategory();
      await trainings.fillDate(date);
      await trainings.fillVideo(video);
      await trainings.clickSave();
      await expect(page.locator(trainings.SUCCESS_POPUP)).toContainText('Success');
      await trainings.clickOK();
    });
    await test.step('Search the added  Trainingand', async () => {
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await trainings.searchTraining(TRAINING_NAME);
      await expect(page.locator(trainings.RESULT_FIRST_TABLE)).toBeVisible();
      await expect(page.locator(trainings.RESULT_TITLE)).toContainText(TRAINING_NAME);
      await expect(page.locator(trainings.RESULT_DESCRIPTION)).toContainText(shortDescription);
      await expect(page.locator(trainings.RESULT_VIDEO)).toHaveAttribute('data-url', video);
    });
    await test.step('Edit the added  Training and verify changes are present', async () => {
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await trainings.editSearchedTraining();
      await trainings.enterShortDescription(shortDescription);
      await trainings.enterTitle(TRAINING_NAME_UPDATE);
      await trainings.clickSave();
      await trainings.clickOK();
      await trainings.searchTraining(TRAINING_NAME_UPDATE);
      await expect(page.locator(trainings.RESULT_FIRST_TABLE)).toBeVisible();
      await expect(page.locator(trainings.RESULT_TITLE)).toContainText(TRAINING_NAME_UPDATE);
      await expect(page.locator(trainings.RESULT_DESCRIPTION)).toContainText(
        shortDescription_update,
      );
      await expect(page.locator(trainings.RESULT_VIDEO)).toHaveAttribute('data-url', video);
      await trainings.searchTraining(TRAINING_NAME);
      await expect(page.locator(trainings.RESULT_TITLE)).not.toContainText(TRAINING_NAME_UPDATE);
      await expect(page.locator(trainings.RESULT_DESCRIPTION)).not.toContainText(
        shortDescription_update,
      );
    });
    await test.step('Delete the added Training', async () => {
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await trainings.searchTraining(TRAINING_NAME_UPDATE);
      await trainings.deleteSearchedTraining();
      await trainings.confirmDeleteTraining();
      await trainings.searchTraining(TRAINING_NAME_UPDATE);
      await expect(page.locator(trainings.RESULT_TITLE)).not.toContainText(TRAINING_NAME_UPDATE);
      await expect(page.locator(trainings.RESULT_DESCRIPTION)).not.toContainText(
        shortDescription_update,
      );
    });
  });
});
