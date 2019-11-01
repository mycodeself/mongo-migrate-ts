export const oraMock = () => ({
  start: () => ({
    succeed: () => ({ stop: () => jest.fn() })
  })
});
