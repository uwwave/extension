import { Runtime, runtime } from 'webextension-polyfill'
import * as browser from 'webextension-polyfill'
import MessageSender = Runtime.MessageSender
import OnInstalledDetailsType = Runtime.OnInstalledDetailsType

export enum ExtensionResource {
    HelperContainer = 'resources/html/ww_helper.html',
    WaveLogo = 'assets/waterlooworks/wave_logo_black.png',
    WaveLogoToolbar = 'assets/waterlooworks/wave_logo_toolbar.png',
}

export function getResourceUrl(resource: ExtensionResource) {
    return runtime.getURL(resource)
}

export function getExtensionId() {
    return browser.runtime.id
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/getBrowserInfo
// only works on firefox
export async function getBrowserInfo() {
    return await browser.runtime.getBrowserInfo()
}

export function getExtensionVersion() {
    return browser.runtime.getManifest().version
}

export function addRuntimeListener(
    listener: (
        message: any,
        sender: MessageSender,
        sendResponse: (...params: any) => void,
    ) => void,
) {
    browser.runtime.onMessage.addListener(listener)
}

export function addRuntimeOnInstalledListener(
    listener: (details: OnInstalledDetailsType) => void,
) {
    browser.runtime.onInstalled.addListener(listener)
}

export function getBackgroundPage() {
    browser.extension.getBackgroundPage()
}
