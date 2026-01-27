import { test } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";

const API_BASE_URL = "http://localhost:3000";

async function deleteAllByQuery(
  request: APIRequestContext,
  path: string,
): Promise<void> {
  const response = await request.get(`${API_BASE_URL}${path}`);
  const items = (await response.json()) as Array<{ id: string }>;
  const basePath = path.split("?")[0];
  await Promise.all(
    items.map((item) =>
      request.delete(`${API_BASE_URL}${basePath}/${item.id}`),
    ),
  );
}

async function resetCartForUser(request: APIRequestContext, userId: string) {
  await deleteAllByQuery(request, `/cartItems?userId=${userId}`);
}

async function resetOrdersForUser(request: APIRequestContext, userId: string) {
  await deleteAllByQuery(request, `/orders?userId=${userId}`);
}

export { API_BASE_URL, deleteAllByQuery, resetCartForUser, resetOrdersForUser, test };

