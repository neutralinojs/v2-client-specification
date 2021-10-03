
declare module 'Neutralino.app' {

export interface AlwaysSuccessResponse {
    /**
     * Always true
     */
    success: boolean;
}

export interface GetConfigResponse {
    returnValue: ReturnValue;
    success:     boolean;
}

export interface ReturnValue {
    /**
     * Unique string to identify your application. Eg: `js.neutralino.sample`
     */
    applicationId: string;
    cli:           CLI;
    /**
     * Mode of the application. Accepted values are `window`, `browser`, and `cloud`.
     */
    defaultMode: DefaultMode;
    /**
     * Enables or disables the background server (The static file server and native API).
     */
    enableHTTPServer: boolean;
    /**
     * Enables or disables the native API. For better security, this setting should be `false`
     * if you are using a
     * remote URL as your web frontend.
     */
    enableNativeAPI: boolean;
    /**
     * A key-value-based JavaScript object of custom [global
     * variables](../developer-environment/global-variables#custom-global-variables).
     */
    globalVariables: { [key: string]: any };
    modes:           Modes;
    /**
     * An array of native methods needs to be blocked from the frontend of the application.
     */
    nativeBlockList: string[];
    /**
     * The port of your application. If the value is `0`, Neutralinojs will use a random
     * available port.
     */
    port: number;
    /**
     * The entry URL of the application. Neutralinojs will initially load this URL.
     * This property accepts both relative and absolute URLs.
     */
    url: string;
}

export interface CLI {
    /**
     * Binary file name of your application. If it is `myapp`, all binaries should use
     * `myapp-<platform>` format.
     */
    binaryName: string;
    /**
     * Neutralinojs server version. neu CLI adds this property when the project is scaffolded.
     */
    binaryVersion?: string;
    /**
     * Filename of the Neutralinojs JavaScript library.
     */
    clientLibrary: string;
    /**
     * Neutralinojs client version. neu CLI adds this property when the project is scaffolded.
     */
    clientVersion?: string;
    /**
     * Path of your application resources.
     */
    resourcesPath: string;
}

/**
 * Mode of the application. Accepted values are `window`, `browser`, and `cloud`.
 */
export enum DefaultMode {
    Browser = "browser",
    Cloud = "cloud",
    Window = "window",
}

export interface Modes {
    browser: { [key: string]: any };
    cloud:   { [key: string]: any };
    window:  Window;
}

export interface Window {
    /**
     * Activates the top-most mode.
     */
    alwaysOnTop: boolean;
    /**
     * Activates the borderless mode.
     */
    borderless: boolean;
    /**
     * Automatically opens the developer tools window.
     */
    enableInspector: boolean;
    /**
     * Activates the full-screen mode.
     */
    fullScreen: boolean;
    /**
     * Height of the native window.
     */
    height: number;
    /**
     * Make the window invisible. This setting can be used to develop background services.
     */
    hidden: boolean;
    /**
     * Application icon's file name. You can directly point to an image file in the
     * resources directory. We recommend you to choose a transparent PNG file.
     */
    icon: string;
    /**
     * Maximum height of the native window.
     */
    maxHeight?: number;
    /**
     * Launches the application maximized.
     */
    maximize: boolean;
    /**
     * Maximum width of the native window.
     */
    maxWidth?: number;
    /**
     * Minimum height of the native window.
     */
    minHeight: number;
    /**
     * Minimum width of the native window.
     */
    minWidth: number;
    /**
     * Make the window resizable or not. The default value is `true`.
     */
    resizable: boolean;
    /**
     * Title of the native window.
     */
    title: string;
    /**
     * Width of the native window.
     */
    width: number;
}

export interface KeepAliveResponse {
    message?: string;
    success?: boolean;
}

}

declare module 'Neutralino.window' {

export interface AlwaysSuccessResponse {
    /**
     * Always true
     */
    success: boolean;
}

export interface IsMaximizedResponse {
    returnValue?: boolean;
    success?:     boolean;
}

export interface IsFullScreenResponse {
    returnValue?: boolean;
    success?:     boolean;
}

export interface IsVisibleResponse {
    returnValue?: boolean;
    success?:     boolean;
}

}