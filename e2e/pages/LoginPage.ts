import type { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.page.getByTestId("login-email").fill(email);
    await this.page.getByTestId("login-password").fill(password);
    await this.page.getByTestId("login-submit").click();
  }

  async expectToBeOnLoginPage() {
    await this.page.waitForURL("/login");
  }

  async expectLoginHeading() {
    const heading = this.page.getByRole("heading", { name: "로그인" });
    await heading.waitFor({ state: "visible" });
  }
}
