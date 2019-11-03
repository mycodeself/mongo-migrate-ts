export const oraMock = () => ({
  start: () => ({
    succeed: () => ({ stop: () => jest.fn() }),
    warn: () => ({ stop: () => jest.fn() })
  })
});
