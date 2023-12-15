/*
 * @Author: Lowkey
 * @Date: 2023-12-13 18:09:46
 * @LastEditors: Lowkey
 * @LastEditTime: 2023-12-14 18:01:33
 * @FilePath: \BK-Portal-VUE\src\utils\env.ts
 * @Description: 
 */
import pkg from '../../package.json';
import { judgePlatform } from '@/utils/platform';
import { PLATFORMS } from '@/enums/platformEnum';
import { devBaseUrlEnums,prodBaseUrlEnums } from '@/enums/baseUrlEnums';

/**
 * @description: Generate cache key according to version
 */
export function getPkgVersion() {
    return `${`__${pkg.version}`}__`.toUpperCase();
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment mode
 * @returns:
 * @example:
 */
export function getEnvMode(): string {
    return getEnvValue('VITE_ENV');
}

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnvValue<T = string>(key: keyof ImportMetaEnv): T {
    const envValue = import.meta.env[key];
    return (envValue === 'true' ? true : envValue === 'false' ? false : envValue) as unknown as T;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
    return getEnvMode() === devMode;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
    return getEnvMode() === prodMode;
}

/**
 * @description: Get environment VITE_BASE_URL value
 * @returns:
 * @example:
 */
export function getBaseUrl(): Record<string,string> {
    return isDevMode()?devBaseUrlEnums:prodBaseUrlEnums;
}

/**
 * @description: Get environment VITE_UPLOAD_URL value
 * @returns:
 * @example:
 */
export function getUploadUrl(): string {
    if (judgePlatform(PLATFORMS.H5) && isDevMode()) return '/upload';
    return getEnvValue<string>('VITE_UPLOAD_URL');
}
