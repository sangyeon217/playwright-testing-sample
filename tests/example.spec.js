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

test("requestfailed 이벤트 탐지 테스트", async ({ page }) => {
  const errorLogs = [];
  const url = "https://help.naver.com/index.help";

  page.on("requestfailed", (req) => {
    console.error(
      `${url} : ${req.method()} ${req.url()} ${req.failure().errorText}`,
    );
    /* 출력 예시
      https://help.naver.com/index.help : GET https://api-help.naver.com/api/v1/user net::ERR_FAILED
    */
    errorLogs.push(req.failure().errorText);
  });

  await page.goto(url);
  await page.waitForLoadState("networkidle");
  expect(errorLogs.length).toBe(0);
});

test("response 오류 탐지 테스트", async ({ page }) => {
  const errorLogs = [];
  const url = "https://m.entertain.naver.com/now?sid=225";

  page.on("response", (response) => {
    const status = response.status();
    if (status >= 400) {
      console.error(
        `${url} : ${response.request().method()} ${response.url()} ${status}`,
      );
      /* 출력 예시
        https://m.entertain.naver.com/now?sid=225 : GET https://m.entertain.naver.com/null?type=nf176_176 404
      */
      errorLogs.push(status);
    }
  });

  await page.goto(url);
  await page.waitForLoadState("networkidle");
  expect(errorLogs.length).toBe(0);
});

test("pageerror 이벤트 탐지 테스트", async ({ page }) => {
  const errorLogs = [];
  const url =
    "https://m.sports.naver.com/milanocortina2026/article/469/0000912828";

  page.on("pageerror", (err) => {
    console.error(`${url} : ${err.message}`);
    /* 출력 예시
      https://m.sports.naver.com/milanocortina2026/article/469/0000912828 : Minified React error #418; visit https://react.dev/errors/418 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
    */
    errorLogs.push(err.message);
  });

  await page.goto(url);
  await page.waitForLoadState("networkidle");
  expect(errorLogs.length).toBe(0);
});

test("console 오류 탐지 테스트", async ({ page }) => {
  const errorLogs = [];
  const url = "https://help.naver.com/index.help";

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`${url} : ${msg.text()}`);
      /* 출력 예시
        https://help.naver.com/index.help : Access to XMLHttpRequest at 'https://api-help.naver.com/api/v1/user' from origin 'https://help.naver.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
        https://help.naver.com/index.help : Failed to load resource: net::ERR_FAILED
      */
      errorLogs.push(msg.text());
    }
  });

  await page.goto(url);
  await page.waitForLoadState("networkidle");
  expect(errorLogs.length).toBe(0);
});
