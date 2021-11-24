import { Config } from '../config';
interface CommandStatusOptions {
  config: Config;
}
export declare const status: (opts: CommandStatusOptions) => Promise<void>;
export {};
