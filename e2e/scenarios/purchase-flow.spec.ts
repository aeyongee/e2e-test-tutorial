import { test, expect } from "../helpers/test";
import { resetCartForUser, resetOrdersForUser } from "../helpers/api";
import { testUsers } from "../fixtures/users";
import { testProducts } from "../fixtures/products";

test.describe("구매 플로우", () => {
  const demoUser = testUsers.demo;

  test.beforeEach(async ({ request }) => {
    // 각 테스트 전에 장바구니와 주문 내역 초기화
    await resetCartForUser(request, demoUser.id);
    await resetOrdersForUser(request, demoUser.id);
  });

  test.afterEach(async ({ request }) => {
    // 각 테스트 후에도 장바구니와 주문 내역 초기화
    await resetCartForUser(request, demoUser.id);
    await resetOrdersForUser(request, demoUser.id);
  });

  test("로그인 -> 상품 보기 -> 장바구니 담기 -> 구매하기", async ({
    loginPage,
    productsPage,
    cartPage,
  }) => {
    // 1. 로그인 페이지로 이동
    await loginPage.goto();
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectLoginHeading();

    // 2. 데모 계정으로 로그인
    await loginPage.login(demoUser.email, demoUser.password);

    // 3. 상품 목록 페이지로 리다이렉트 확인
    await productsPage.expectToBeOnProductsPage();
    await productsPage.expectProductsHeading();

    // 4. 첫 번째 상품을 장바구니에 추가
    const product = testProducts.cloudLinenBedding;
    await productsPage.expectProductCard(product.id);
    await productsPage.expectProductName(product.id, product.name);
    await productsPage.addToCart(product.id);

    // 5. 장바구니 페이지로 이동
    await cartPage.goto();
    await cartPage.expectToBeOnCartPage();
    await cartPage.expectCartHeading();

    // 6. 장바구니에 상품이 있는지 확인
    await cartPage.expectCartItem(product.name);

    // 7. 구매하기
    await cartPage.checkout();
    await cartPage.expectCheckoutSuccess();

    // 8. 장바구니가 비워졌는지 확인
    await cartPage.expectEmptyCart();
  });
});
