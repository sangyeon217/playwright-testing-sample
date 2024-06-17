const { test, expect } = require("@playwright/test");
const {
  GooglePage,
} = require("@sangyeon217/nodejs-sample-package/google-page");

test("Google Page Has Title", async ({ page }) => {
  const googlePage = new GooglePage(page);
  await googlePage.goto();
  await expect(page).toHaveTitle(/Google/);
});
