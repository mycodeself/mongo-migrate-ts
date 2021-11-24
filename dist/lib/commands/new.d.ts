interface CommandNewOptions {
  migrationsDir: string;
  migrationName?: string;
}
export declare const migrationTemplate: (className: string) => string;
export declare const newCommand: (opts: CommandNewOptions) => string;
export {};
