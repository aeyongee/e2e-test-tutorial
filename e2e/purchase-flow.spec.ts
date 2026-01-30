import { expect } from "@playwright/test";
import { test, resetCartForUser, resetOrdersForUser } from "./helper";

test.describe("구매 플로우", () => {
  const testUserId = "1"; // demo@breeze.com 사용자 ID

  test.beforeEach(async ({ request }) => {
    // 각 테스트 전에 장바구니와 주문 내역 초기화
    await resetCartForUser(request, testUserId);
    await resetOrdersForUser(request, testUserId);
  });

  test.afterEach(async ({ request }) => {
    // 각 테스트 후에도 장바구니와 주문 내역 초기화
    await resetCartForUser(request, testUserId);
    await resetOrdersForUser(request, testUserId);
  });

  test("로그인 -> 상품 보기 -> 장바구니 담기 -> 구매하기", async ({
    page,
  }) => {
    // 1. 로그인 페이지로 이동
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
    await expect(
      page.getByRole("heading", { name: "로그인" }),
    ).toBeVisible();

    // 2. 데모 계정으로 로그인
    await page.getByTestId("login-email").fill("demo@breeze.com");
    await page.getByTestId("login-password").fill("demo1234");
    await page.getByTestId("login-submit").click();

    // 3. 상품 목록 페이지로 리다이렉트 확인
    await expect(page).toHaveURL("/products");
    await expect(
      page.getByRole("heading", { name: "오늘의 추천 상품" }),
    ).toBeVisible();

    // 상품이 로드될 때까지 대기
    await expect(page.getByTestId("product-card-1")).toBeVisible();

    // 4. 첫 번째 상품(Cloud Linen Bedding)을 장바구니에 추가
    const firstProduct = page.getByTestId("product-card-1");
    await expect(firstProduct).toContainText("Cloud Linen Bedding");

    const addToCartButton = page.getByTestId("add-to-cart-1");
    await addToCartButton.click();

    // 장바구니에 추가되는 시간 대기
    await page.waitForTimeout(500);

    // 5. 장바구니 페이지로 이동
    await page.goto("/cart");
    await expect(page).toHaveURL("/cart");
    await expect(
      page.getByRole("heading", { name: "장바구니 목록" }),
    ).toBeVisible();

    // 장바구니에 상품이 있는지 확인
    const cartItem = page.getByTestId("cart-item");
    await expect(cartItem).toBeVisible();
    await expect(cartItem).toContainText("Cloud Linen Bedding");

    // 6. 구매하기 버튼 클릭
    const checkoutButton = page.getByTestId("checkout-button");
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();

    // 7. 주문 완료 메시지 확인
    await expect(
      page.getByText("주문이 완료되었어요. 감사합니다!"),
    ).toBeVisible();

    // 장바구니가 비워졌는지 확인
    await expect(
      page.getByText("장바구니가 비어 있어요. 상품을 담아보세요."),
    ).toBeVisible();
  });
});
