export class DbConnectionError extends Error {
  constructor(error: string) {
    super(error);
  }
}
