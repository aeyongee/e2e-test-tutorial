import { expect } from "@playwright/test";
import { resetCartForUser, resetOrdersForUser, test } from "./helpers";

test("로그인 -> 장바구니 담기 -> 구매", async ({ page, request }) => {
  await resetCartForUser(request, "1");
  await resetOrdersForUser(request, "1");

  await page.goto("/login");
  await page.getByTestId("login-email").fill("demo@breeze.com");
  await page.getByTestId("login-password").fill("demo1234");
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/\/products/);

  await page.getByTestId("add-to-cart-1").click();
  await expect(page.getByText("장바구니에 담았어요.")).toBeVisible();

  await page.getByTestId("nav-cart").click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByTestId("cart-item")).toHaveCount(1);

  await page.getByTestId("checkout-button").click();
  await expect(page.getByTestId("checkout-button")).toBeDisabled();
  await expect(page.getByText("결제 진행 중...")).toBeVisible();

  await expect(
    page.getByText("주문이 완료되었어요. 감사합니다!"),
  ).toBeVisible();

  // cleanup: keep db.json stable for repeated runs
  await resetCartForUser(request, "1");
  await resetOrdersForUser(request, "1");
});

