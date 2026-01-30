import { expect } from "@playwright/test";
import {
  test,
  API_BASE_URL,
  resetCartForUser,
  resetOrdersForUser,
} from "./helper";

test.describe("인증 플로우", () => {
  let createdUserId: string | null = null;

  test.afterEach(async ({ request }) => {
    // 테스트 후 생성된 사용자의 데이터 정리
    if (createdUserId) {
      await resetCartForUser(request, createdUserId);
      await resetOrdersForUser(request, createdUserId);
      await request.delete(`${API_BASE_URL}/users/${createdUserId}`);
      createdUserId = null;
    }
  });

  test("회원가입 -> 로그인", async ({ page, request }) => {
    // 고유한 이메일 생성 (타임스탬프 사용)
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;
    const testPassword = "testpass123";
    const testName = "테스트유저";

    // 1. 회원가입 페이지로 이동
    await page.goto("/signup");
    await expect(page).toHaveURL("/signup");
    await expect(
      page.getByRole("heading", { name: "회원가입" }),
    ).toBeVisible();

    // 2. 회원가입 폼 작성
    await page.getByRole("textbox", { name: "이름" }).fill(testName);
    await page.getByRole("textbox", { name: "이메일" }).fill(testEmail);
    await page.getByRole("textbox", { name: "비밀번호" }).fill(testPassword);

    // 3. 회원가입 버튼 클릭
    await page.getByRole("button", { name: "회원가입 완료하기" }).click();

    // 4. 회원가입 성공 후 상품 페이지로 리다이렉트 확인
    await expect(page).toHaveURL("/products");
    await expect(
      page.getByRole("heading", { name: "오늘의 추천 상품" }),
    ).toBeVisible();

    // 5. 네비게이션 바에서 사용자 이름 확인 (로그인 상태)
    await expect(page.getByText(testName)).toBeVisible();

    // 6. 로그아웃 (네비게이션 바에서 로그아웃 버튼 찾기)
    const logoutButton = page.getByRole("button", { name: "로그아웃" });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // 로그아웃 후 홈페이지로 리다이렉트 확인
    await expect(page).toHaveURL("/");

    // 7. 로그인 페이지로 이동
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
    await expect(
      page.getByRole("heading", { name: "로그인" }),
    ).toBeVisible();

    // 8. 방금 생성한 계정으로 로그인
    await page.getByTestId("login-email").fill(testEmail);
    await page.getByTestId("login-password").fill(testPassword);
    await page.getByTestId("login-submit").click();

    // 9. 로그인 성공 확인 - 상품 페이지로 리다이렉트
    await expect(page).toHaveURL("/products");
    await expect(
      page.getByRole("heading", { name: "오늘의 추천 상품" }),
    ).toBeVisible();

    // 네비게이션 바에서 사용자 이름 다시 확인
    await expect(page.getByText(testName)).toBeVisible();

    // 생성한 사용자 ID 저장 (afterEach에서 정리)
    const usersResponse = await request.get(`${API_BASE_URL}/users`);
    const users = (await usersResponse.json()) as Array<{
      id: string;
      email: string;
    }>;
    const createdUser = users.find((u) => u.email === testEmail);
    if (createdUser) {
      createdUserId = createdUser.id;
    }
  });
});
