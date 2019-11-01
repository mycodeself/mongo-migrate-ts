export const connectionMock = {
  db: {
    collection: jest.fn()
  },
  client: {
    close: jest.fn()
  }
};
