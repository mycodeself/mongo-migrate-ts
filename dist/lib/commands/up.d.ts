import { Config } from '../config';
interface CommandUpOptions {
  config: Config;
}
export declare const up: (opts: CommandUpOptions) => Promise<void>;
export {};
