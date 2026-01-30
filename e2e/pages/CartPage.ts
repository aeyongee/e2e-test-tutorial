import type { Page } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/cart");
  }

  async expectToBeOnCartPage() {
    await this.page.waitForURL("/cart");
  }

  async expectCartHeading() {
    const heading = this.page.getByRole("heading", { name: "장바구니 목록" });
    await heading.waitFor({ state: "visible" });
  }

  async expectCartItem(productName: string) {
    const cartItem = this.page.getByTestId("cart-item");
    await cartItem.waitFor({ state: "visible" });
    await cartItem.getByText(productName).waitFor({ state: "visible" });
  }

  async expectEmptyCart() {
    const emptyMessage = this.page.getByText(
      "장바구니가 비어 있어요. 상품을 담아보세요.",
    );
    await emptyMessage.waitFor({ state: "visible" });
  }

  async checkout() {
    const button = this.page.getByTestId("checkout-button");
    await button.waitFor({ state: "visible" });
    await button.click();
  }

  async expectCheckoutSuccess() {
    const message = this.page.getByText("주문이 완료되었어요. 감사합니다!");
    await message.waitFor({ state: "visible" });
  }
}
