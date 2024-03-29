/// <reference types="node" />
import type { ISetupProperties } from '@comunica/runner';
export declare function runArgs(configResourceUrl: string, argv: string[], stdin: NodeJS.ReadStream, stdout: NodeJS.WriteStream, stderr: NodeJS.WriteStream, env: NodeJS.ProcessEnv, runnerUri?: string, properties?: ISetupProperties): void;
export declare function runArgsInProcess(moduleRootPath: string, defaultConfigPath: string): void;
export declare function runArgsInProcessStatic(actor: any): void;
