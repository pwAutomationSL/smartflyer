import { test, expect } from "../../../fixtures/PlaywrightFixtures";

const PASSENGER_FIRST_NAME = "Test";
const PASSENGER_LAST_NAME = "LastName";
const EMAIL = "theo.pougeon+43@scrumlaunch.com";
const PHONE = "18333333333";
const WRONG_EMAIL = "theo.pougeon+43scrumlaunch.com";
let passengerCompleteName: string;
const normalizePhoneNumber = (str: string | null | undefined): string => {
  if (!str) return "";
  return str.replace(/[^\d+]/g, "");
};
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
test.describe("AR-003 - Air Request - Step 2, 9#, #10, #11 ,#12 ,#13 ,#14 ,#15 ,#16 ,#17 ,#18 ", () => {
  test.setTimeout(200_000);
  test("Air Request - Step 2 - 9# and #10 Scenario - Add Additional Passenger", async ({
    loginPage,
    page,
    sidebar,
    clients,
    toast,
    airRequest,
  }, testInfo) => {
    await test.step("1 - Go to the Client tab", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
    });

    await test.step("2 - Search the client and go to the client page", async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState("networkidle");
    });

    await test.step("3 - 4 - Go to the New credit card tab and Click on Air request button", async () => {
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });

    await test.step("5 - Click on Start from scratch", async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        "Select an agent"
      );

      await test.step("6 - Select the Agent and Click on Continue button", async () => {
        await airRequest.selectAgent();
        await airRequest.selectFirstAgent();
        await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      });

      await test.step("7 - Click on Continue", async () => {
        await airRequest.clickContinue();
        await expect(page.locator(airRequest.HEADER)).toContainText(
          "Passenger details"
        );
        await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
          "background-color",
          "rgb(46, 139, 87)"
        );
      });

      await test.step("9# Add passport information for Secondary Passenger", async () => {
        await airRequest.addAdditionalPassenger();
        await expect(page.locator(airRequest.POP_UP_DIALOG)).toBeVisible();
        await expect(page.locator(airRequest.POP_UP_CANCEL)).toBeVisible();
        await expect(
          page.locator(airRequest.POP_UP_ADD_PASSENGERS)
        ).toBeVisible();
        await expect(page.locator(airRequest.POP_UP_HEADER)).toContainText(
          "Who is traveling?"
        );
        await expect(page.locator(airRequest.POP_UP_TEXT)).toContainText(
          "Select additional travelers from your client list to include in this request."
        );
      });

      await test.step("9# Add first passenger", async () => {
        try {
          const passengerName = await page
            .locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES)
            .first()
            .textContent();
          await airRequest.selectFirstPassenger();
          const passengerNameAdded = await page
            .locator(airRequest.SELECTED_PASSENGER_IN_INPUT)
            .first()
            .textContent();
          expect(passengerName).toBe(passengerNameAdded);
          const addedPassenger = await airRequest.addPassenger();
          const phoneUI = await page
            .locator(airRequest.PHONE_INPUT_PASSENGER(1))
            .inputValue();
          await expect(page.locator(airRequest.PASSENGER_EMAIL(1))).toHaveValue(
            addedPassenger.email
          );
          const firstName = await page
            .locator(airRequest.FIRST_NAME_PASSENGER(1))
            .inputValue();
          const lastName = await page
            .locator(airRequest.LAST_NAME_PASSENGER(1))
            .inputValue();
          passengerCompleteName = `${firstName} ${lastName}`;
          expect(firstName).toBe(addedPassenger.firstName);
          expect(lastName).toBe(addedPassenger.lastName);
          expect(normalizePhoneNumber(phoneUI)).toBe(
            normalizePhoneNumber(addedPassenger.phone)
          );
        } catch (err) {
          console.error(
            "Secondary Passenger non matching pre populated fields"
          );
          test.info().errors.push({
            message: String(err),
          });
        }
      });

      await test.step("9# - ER - Gender has red asterisk and its mandatory", async () => {
        await expect(
          page.locator(airRequest.GENDER_RED_ASTERISK).last()
        ).toBeVisible();
        await airRequest.clickGenderDropdown(2);
        await expect(page.locator(airRequest.MALE_DROPDOWN)).toBeVisible();
        await expect(page.locator(airRequest.FEMALE_DROPDOWN)).toBeVisible();
        await airRequest.selectMale();
        await expect(page.locator(airRequest.PHONE_FLAG).last()).toBeVisible();
      });

      await test.step("9# - ER - Edit Secondary Passenger phone number", async () => {
        try {
          await airRequest.fillPassengerPhone("", 1);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_PHONE)).toContainText(
            "Invalid phone number"
          );
          await expect(
            page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(1))
          ).toHaveClass(/border-red/i);
          await airRequest.fillPassengerPhone("1800", 1);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_PHONE)).toContainText(
            "Invalid phone number"
          );
          await expect(
            page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(1))
          ).toHaveClass(/border-red/i);
          await airRequest.fillPassengerPhone(PHONE, 1);
          await airRequest.clickLabel();
          await expect(
            page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(1))
          ).not.toHaveClass(/border-red/i);
        } catch (err) {
          console.error(" Edit Secondary Passenger phone number");
          test.info().errors.push({
            message: String(err),
          });
        }
      });

      await test.step("9# - ER Secondary Passenger DoB", async () => {
        try {
          await airRequest.fillDayOfBirth("", 2);
          await airRequest.fillMonth(2);
          await airRequest.fillYearOfBirth("", 2);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_DOB)).toContainText(
            "Day, Year are required"
          );
          await expect(page.locator(airRequest.DOB_DAY(2))).toHaveClass(
            /border-red/i
          );
          await expect(page.locator(airRequest.DOB_YEAR(2))).toHaveClass(
            /border-red/i
          );
          await airRequest.fillDayOfBirth("15", 2);
          await airRequest.fillYearOfBirth("2200", 2);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_DOB)).toContainText(
            "Date of birth must be before today."
          );
          await expect(page.locator(airRequest.DOB_DAY(2))).toHaveClass(
            /border-red/i
          );
          await expect(page.locator(airRequest.DOB_YEAR(2))).toHaveClass(
            /border-red/i
          );
          await airRequest.clickLabel();
          await airRequest.fillYearOfBirth("1900", 2);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.DOB_DAY(2))).not.toHaveClass(
            /border-red/i
          );
          await expect(page.locator(airRequest.DOB_YEAR(2))).not.toHaveClass(
            /border-red/i
          );
        } catch (err) {
          console.error("ER Secondary Passenger DoB");
          test.info().errors.push({
            message: String(err),
          });
        }
      });

      await test.step("9# - ER  - Add passport information toggle OFF by default", async () => {
        await expect(
          page.locator(airRequest.ADD_PASSPORT_INFORMATION(2)).last()
        ).toHaveAttribute("aria-checked", "false");
      });

      await test.step("9# - ER  - Edit Secondary Passenger email", async () => {
        try {
          await airRequest.fillPassengerEmail(WRONG_EMAIL, 2);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_EMAIL)).toContainText(
            "Email must be a valid email address."
          );
          await expect(page.locator(airRequest.PASSENGER_EMAIL(1))).toHaveClass(
            /border-red/i
          );
          await airRequest.fillPassengerEmail("", 2);
          await airRequest.clickLabel();
          await expect(
            page.locator(airRequest.WARNING_EMAIL)
          ).not.toBeVisible();
          await airRequest.fillPassengerEmail(EMAIL, 2);
        } catch (err) {
          console.error("Edit Secondary Passenger email");
          test.info().errors.push({
            message: String(err),
          });
        }
      });

      await test.step("9# - ER  - Verify that already selected passengers don’t appear on “Who is traveling” popup", async () => {
        try {
          await airRequest.addAdditionalPassenger();
          await expect(page.locator(airRequest.POP_UP_DIALOG)).toBeVisible();
          await expect(page.locator(airRequest.POP_UP_CANCEL)).toBeVisible();
          await expect(
            page.locator(airRequest.POP_UP_ADD_PASSENGERS)
          ).toBeVisible();
          const allNames = await page
            .locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES)
            .allTextContents();
          await expect(allNames).not.toContain(passengerCompleteName);
          await airRequest.clickCancel();
        } catch (err) {
          console.error(
            "Verify that already selected passengers don’t appear on “Who is traveling” popup"
          );
          test.info().errors.push({
            message: String(err),
          });
        }
      });

      await test.step("10# - ER  - Add Additional Passenger passport - Verify if user try to upload file format that isn’t allowed the validation appear", async () => {
        try {
          await expect(
            page.locator(airRequest.ADD_PASSPORT_INFORMATION(2))
          ).toBeVisible();
          await airRequest.addPassportInformation(2);
          await airRequest.addIncorrectFile();
          await expect(
            page.locator(airRequest.UPLOAD_FILE_BUTTON)
          ).toBeVisible();
          await expect(
            page.locator(airRequest.UPLOAD_FILE_P).last()
          ).toContainText("File type(s) not supported");
        } catch (err) {
          console.error(
            " Verify if user try to upload file format that isn’t allowed the validation appear"
          );
          test.info().errors.push({
            message: String(err),
          });
        }
      });

      await test.step("10# - ER  - Verify if user try to upload the 1 file more than 25 MB the validation appear", async () => {
        try {
          await airRequest.addLargeSizeFile();
          await expect(
            page.locator(airRequest.UPLOAD_FILE_P).last()
          ).toContainText("File size limits");
          await airRequest.clickCancel();
        } catch (err) {
          console.error(
            "Verify if user try to upload the 1 file more than 25 MB the validation appear"
          );
          test.info().errors.push({
            message: String(err),
          });
        }
      });

      await test.step("10# - ER  - Upload 2 files and assert they are visible with thumbnail", async () => {
        try {
          await expect(
            page.locator(airRequest.UPLOAD_FILE_BUTTON)
          ).toBeVisible();
          await expect(
            page.locator(airRequest.UPLOAD_FILE_P).first()
          ).toContainText("Drag your file(s) to start uploading");
          await expect(
            page.locator(airRequest.UPLOAD_FILE_P).nth(1)
          ).toContainText("PDF, JPG or PNG (max 25MB per file)");
          await airRequest.addFilePassport("testImage.jpg");
          await expect(page.locator(airRequest.INPUT_FILE)).toBeEnabled();
          await airRequest.addFilePassport("testImage2.png");
          await expect(
            page.locator(airRequest.FILES_UPLOAD_POPUP_UPLOAD_FILES)
          ).toBeVisible();
          await expect(
            page.locator(airRequest.FILES_UPLOAD_POPUP_CANCEL)
          ).toBeVisible();
          const txt = (
            await page.locator(airRequest.FILES_UPLOAD_POPUP_TITLE).innerText()
          )
            .replace(/\s+/g, " ")
            .trim();
          expect(txt).toBe("Passenger 2 - Uploads (2)");
          const imgCount = await page
            .locator(airRequest.FILES_UPLOAD_POPUP_IMG)
            .count();
          expect(imgCount).toBe(2);
          await airRequest.uploadAddedFiles();
          await expect(
            page.locator(airRequest.FILES_UPLOAD_POPUP_SUCCESS_BAR)
          ).toBeVisible({ timeout: 10000 });
          await expect(
            page.locator(airRequest.FILES_UPLOAD_POPUP_SUCCESS_BAR_2)
          ).toBeVisible();
          const uploadedImgCount = await page
            .locator(airRequest.UPLOADED_IMAGES)
            .count();
          expect(uploadedImgCount).toBe(2);
        } catch (err) {
          console.error(
            " Upload 2 files and assert they are visible with thumbnail"
          );
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step("10# - ER  - Verify that user can upload max 2 files for passenger", async () => {
        try {
          await airRequest.closePopUp();
          await expect(
            page.locator(airRequest.FILES_UPLOAD_POPUP_IMG)
          ).not.toBeVisible();
          await expect(
            page.locator(airRequest.UPLOAD_MORE_FILES)
          ).toBeDisabled();
        } catch (err) {
          console.error(
            "Verify that user can upload max 2 files for passenger"
          );
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step("11# - ER  - Edit Additional Passenger first name", async () => {
        try {
          await airRequest.fillPassengerFirstName("", 1);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_NAME)).toContainText(
            "First name is required"
          );
          await expect(
            page.locator(airRequest.FIRST_NAME_PASSENGER(1))
          ).toHaveClass(/border-red/i);
          await airRequest.fillPassengerFirstName(PASSENGER_FIRST_NAME, 1);
          await airRequest.clickLabel();
        } catch (err) {
          console.error("Edit Secondary Passenger First Name failed");
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step("12# Scenario - Edit Secondary Passenger Middle Name", async () => {
        try {
          await airRequest.fillPassengerMiddleName("", 1);
          await airRequest.clickLabel();
          await expect(
            page.locator(airRequest.WARNING_MIDDLE_NAME)
          ).toBeHidden();
          await airRequest.fillPassengerMiddleName("MiddleName", 1);
          await airRequest.clickLabel();
        } catch (err) {
          console.error("Edit Secondary Passenger Middle Name");
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step("13# Scenario - Edit Secondary Passenger Last Name", async () => {
        try {
          await airRequest.fillPassengerLastName("", 1);
          await airRequest.clickLabel();
          await expect(
            page.locator(airRequest.WARNING_LAST_NAME)
          ).toContainText("Last name is required");
          await expect(
            page.locator(airRequest.LAST_NAME_PASSENGER(1))
          ).toHaveClass(/border-red/i);
          await airRequest.fillPassengerLastName(PASSENGER_LAST_NAME, 1);
          await airRequest.clickLabel();
        } catch (err) {
          console.error("Edit Secondary Passenger Last Name");
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step("14# Scenario - Edit Secondary Passenger DoB", async () => {
        try {
          await airRequest.fillDayOfBirth("", 2);
          await airRequest.fillMonth();
          await airRequest.fillYearOfBirth("", 2);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_DOB)).toContainText(
            "Day, Year are required"
          );
          await expect(page.locator(airRequest.DOB_DAY(2))).toHaveClass(
            /border-red/i
          );
          await expect(page.locator(airRequest.DOB_YEAR(2))).toHaveClass(
            /border-red/i
          );
          await airRequest.fillDayOfBirth("15", 2);
          await airRequest.fillYearOfBirth("2200", 2);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_DOB)).toContainText(
            "Date of birth must be before today."
          );
          await expect(page.locator(airRequest.DOB_DAY(2))).toHaveClass(
            /border-red/i
          );
          await expect(page.locator(airRequest.DOB_YEAR(2))).toHaveClass(
            /border-red/i
          );
          await airRequest.clickLabel();
          await airRequest.fillYearOfBirth("1900", 2);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.DOB_DAY(2))).not.toHaveClass(
            /border-red/i
          );
          await expect(page.locator(airRequest.DOB_YEAR(2))).not.toHaveClass(
            /border-red/i
          );
        } catch (err) {
          console.error("Edit Secondary Passenger DoB");
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step("15# Scenario - Edit Secondary Passenger email", async () => {
        try {
          await airRequest.fillPassengerEmail(WRONG_EMAIL, 2);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_EMAIL)).toContainText(
            "Email must be a valid email address."
          );
          await expect(page.locator(airRequest.PASSENGER_EMAIL(1))).toHaveClass(
            /border-red/i
          );
          await airRequest.fillPassengerEmail("", 2);
          await airRequest.clickLabel();
          await expect(
            page.locator(airRequest.WARNING_EMAIL)
          ).not.toBeVisible();
          await expect(
            page.locator(airRequest.PASSENGER_EMAIL(1))
          ).not.toHaveClass(/border-red/i);
          await airRequest.fillPassengerEmail(EMAIL, 2);
        } catch (err) {
          console.error("Edit Secondary Passenger email");
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step("16# Scenario - Edit Secondary Passenger phone number", async () => {
        try {
          await airRequest.fillPassengerPhone("", 1);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_PHONE)).toContainText(
            "Invalid phone number"
          );
          await expect(
            page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(1))
          ).toHaveClass(/border-red/i);
          await airRequest.fillPassengerPhone("1800", 1);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_PHONE)).toContainText(
            "Invalid phone number"
          );
          await expect(
            page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(1))
          ).toHaveClass(/border-red/i);
          await airRequest.fillPassengerPhone(PHONE, 1);
          await airRequest.clickLabel();
          await expect(
            page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(1))
          ).not.toHaveClass(/border-red/i);
        } catch (err) {
          console.error("Secondary Passenger phone number");
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step("17# Scenario - Remove Additional Passenger", async () => {
        try {
          await expect(page.locator(airRequest.HEADER_H4).last()).toContainText(
            "Passenger 2"
          );
          await airRequest.deleteTraveler();
          await expect(page.locator(airRequest.HEADER_H4).last()).toContainText(
            "Passenger 1"
          );
          await airRequest.addAdditionalPassenger();
          await expect(page.locator(airRequest.POP_UP_DIALOG)).toBeVisible();
          await expect(page.locator(airRequest.POP_UP_CANCEL)).toBeVisible();
          await expect(
            page.locator(airRequest.POP_UP_ADD_PASSENGERS)
          ).toBeVisible();
          await expect(
            page.locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES).first()
          ).toBeVisible();
          const allNames = await page
            .locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES)
            .allTextContents();
          await expect(allNames).toContain(passengerCompleteName);
        } catch (err) {
          console.error("Secondary Passenger phone number");
          test.info().errors.push({
            message: String(err),
          });
        }
      });
    });
    if (testInfo.errors.length > 0) {
      throw new Error("One or more validation steps failed. Check report.");
    }
  });
});
