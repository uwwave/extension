import * as browser from 'webextension-polyfill'

export async function createTabWithUrl(url: string) {
    await browser.tabs.create({ url })
}

export async function trySendMessageToActiveTab(op: string): Promise<any> {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    var activeTab = tabs[0]
    var activeTabId = activeTab.id
    var result = null
    if (activeTabId) {
        console.log('sending')
        try {
            result = await browser.tabs.sendMessage(activeTabId, { op })
        } catch {
            result = null
        }
    }
    return result
}
