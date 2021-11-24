import { Config } from '../config';
interface CommandDownOptions {
  config: Config;
  mode: 'all' | 'last';
}
export declare const down: ({
  mode,
  config,
}: CommandDownOptions) => Promise<void>;
export {};
