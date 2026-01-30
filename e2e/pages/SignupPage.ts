import type { Page } from "@playwright/test";

export class SignupPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/signup");
  }

  async signup(name: string, email: string, password: string) {
    await this.page.getByRole("textbox", { name: "이름" }).fill(name);
    await this.page.getByRole("textbox", { name: "이메일" }).fill(email);
    await this.page.getByRole("textbox", { name: "비밀번호" }).fill(password);
    await this.page.getByRole("button", { name: "회원가입 완료하기" }).click();
  }

  async expectToBeOnSignupPage() {
    await this.page.waitForURL("/signup");
  }

  async expectSignupHeading() {
    const heading = this.page.getByRole("heading", { name: "회원가입" });
    await heading.waitFor({ state: "visible" });
  }
}
