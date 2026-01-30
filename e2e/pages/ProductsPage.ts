import type { Page } from "@playwright/test";

export class ProductsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/products");
  }

  async expectToBeOnProductsPage() {
    await this.page.waitForURL("/products");
  }

  async expectProductsHeading() {
    const heading = this.page.getByRole("heading", {
      name: "오늘의 추천 상품",
    });
    await heading.waitFor({ state: "visible" });
  }

  async expectProductCard(productId: string) {
    const card = this.page.getByTestId(`product-card-${productId}`);
    await card.waitFor({ state: "visible" });
  }

  async expectProductName(productId: string, name: string) {
    const card = this.page.getByTestId(`product-card-${productId}`);
    await card.getByText(name).waitFor({ state: "visible" });
  }

  async addToCart(productId: string) {
    const button = this.page.getByTestId(`add-to-cart-${productId}`);
    await button.click();
    // API 요청 완료 대기
    await this.page.waitForTimeout(500);
  }
}
