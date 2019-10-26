export const oraMock = () => ({
  start: () => ({
    succeed: () => ({ stop: () => undefined })
  })
});
