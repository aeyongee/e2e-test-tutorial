import type { APIRequestContext } from "@playwright/test";

export const API_BASE_URL = "http://localhost:3000";

export async function deleteAllByQuery(
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

export async function resetCartForUser(
  request: APIRequestContext,
  userId: string,
) {
  await deleteAllByQuery(request, `/cartItems?userId=${userId}`);
}

export async function resetOrdersForUser(
  request: APIRequestContext,
  userId: string,
) {
  await deleteAllByQuery(request, `/orders?userId=${userId}`);
}

export async function deleteUser(request: APIRequestContext, userId: string) {
  await request.delete(`${API_BASE_URL}/users/${userId}`);
}

export async function findUserByEmail(
  request: APIRequestContext,
  email: string,
): Promise<{ id: string; email: string } | undefined> {
  const response = await request.get(`${API_BASE_URL}/users`);
  const users = (await response.json()) as Array<{ id: string; email: string }>;
  return users.find((u) => u.email === email);
}
