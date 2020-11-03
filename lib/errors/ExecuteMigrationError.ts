export class ExecuteMigrationError extends Error {
  constructor() {
    super('Error executing migrations');
  }
}
