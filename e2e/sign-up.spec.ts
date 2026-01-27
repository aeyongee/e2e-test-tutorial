import { expect } from "@playwright/test";
import { randomUUID } from "crypto";
import { deleteAllByQuery, test } from "./helpers";

test("회원가입 -> 로그인", async ({ page, request }) => {
  const name = "E2E Student";
  const email = `e2e_${randomUUID()}@breeze.com`;
  const password = "e2e12345";

  // cleanup (just in case)
  await deleteAllByQuery(request, `/users?email=${encodeURIComponent(email)}`);

  await page.goto("/signup");
  await page.getByLabel("이름").fill(name);
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(password);
  await page.getByRole("button", { name: "회원가입 완료하기" }).click();

  // signup sets user + navigates to /products
  await expect(page).toHaveURL(/\/products/);
  await expect(page.getByText(`${name} 님`)).toBeVisible();

  // verify login works separately
  await page.getByRole("button", { name: "로그아웃" }).click();
  await page.goto("/login");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/\/products/);
  await expect(page.getByText(`${name} 님`)).toBeVisible();

  // cleanup: remove created user for repeated runs
  await deleteAllByQuery(request, `/users?email=${encodeURIComponent(email)}`);
});

