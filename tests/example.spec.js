const { test, expect } = require("@playwright/test");
const {
  GooglePage,
} = require("@sangyeon217/nodejs-sample-package/google-page");
const { NaverPage } = require("@sangyeon217/nodejs-sample-package/naver-page");

test("Google Page Has Title", async ({ page }) => {
  const googlePage = new GooglePage(page);
  await googlePage.goto();
  await expect(page).toHaveTitle(/Google/);
});

test("Naver Page Has Title", async ({ page }) => {
  const naverPage = new NaverPage(page);
  await naverPage.goto();
  await expect(page).toHaveTitle(/NAVER/);
});
