export class ExecuteMigrationError extends Error {
  constructor(error = '') {
    super(`Error executing migrations ${error}`);
  }
}
