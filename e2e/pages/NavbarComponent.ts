import type { Page } from "@playwright/test";

export class NavbarComponent {
  constructor(private page: Page) {}

  async expectUserName(name: string) {
    const userName = this.page.getByText(`${name} 님`);
    await userName.waitFor({ state: "visible" });
  }

  async logout() {
    const button = this.page.getByRole("button", { name: "로그아웃" });
    await button.waitFor({ state: "visible" });
    await button.click();
  }

  async expectLogoutButton() {
    const button = this.page.getByRole("button", { name: "로그아웃" });
    await button.waitFor({ state: "visible" });
  }
}
