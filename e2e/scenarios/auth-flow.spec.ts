import { test, expect } from "../helpers/test";
import {
  resetCartForUser,
  resetOrdersForUser,
  deleteUser,
  findUserByEmail,
} from "../helpers/api";
import { testUsers } from "../fixtures/users";

test.describe("인증 플로우", () => {
  let createdUserId: string | null = null;

  test.afterEach(async ({ request }) => {
    // 테스트 후 생성된 사용자의 데이터 정리
    if (createdUserId) {
      await resetCartForUser(request, createdUserId);
      await resetOrdersForUser(request, createdUserId);
      await deleteUser(request, createdUserId);
      createdUserId = null;
    }
  });

  test("회원가입 -> 로그인", async ({
    page,
    request,
    signupPage,
    loginPage,
    productsPage,
    navbar,
  }) => {
    // 고유한 이메일 생성
    const timestamp = Date.now();
    const newUser = testUsers.new(timestamp);

    // 1. 회원가입 페이지로 이동
    await signupPage.goto();
    await signupPage.expectToBeOnSignupPage();
    await signupPage.expectSignupHeading();

    // 2. 회원가입
    await signupPage.signup(newUser.name, newUser.email, newUser.password);

    // 3. 회원가입 성공 후 상품 페이지로 리다이렉트 확인
    await productsPage.expectToBeOnProductsPage();
    await productsPage.expectProductsHeading();

    // 4. 네비게이션 바에서 사용자 이름 확인
    await navbar.expectUserName(newUser.name);

    // 5. 로그아웃
    await navbar.expectLogoutButton();
    await navbar.logout();

    // 6. 홈페이지로 리다이렉트 확인
    await expect(page).toHaveURL("/");

    // 7. 로그인 페이지로 이동
    await loginPage.goto();
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectLoginHeading();

    // 8. 방금 생성한 계정으로 로그인
    await loginPage.login(newUser.email, newUser.password);

    // 9. 로그인 성공 확인
    await productsPage.expectToBeOnProductsPage();
    await productsPage.expectProductsHeading();
    await navbar.expectUserName(newUser.name);

    // 생성한 사용자 ID 저장 (afterEach에서 정리)
    const createdUser = await findUserByEmail(request, newUser.email);
    if (createdUser) {
      createdUserId = createdUser.id;
    }
  });
});
