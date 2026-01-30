export const testUsers = {
  demo: {
    email: "demo@breeze.com",
    password: "demo1234",
    id: "1",
  },
  new: (timestamp: number) => ({
    name: "테스트유저",
    email: `testuser${timestamp}@example.com`,
    password: "testpass123",
  }),
};
