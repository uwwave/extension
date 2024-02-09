import { addRuntimeListener, getExtensionId } from '../common/runtime'
import { Runtime } from 'webextension-polyfill'
import MessageSender = Runtime.MessageSender
import { scraper } from './scraper'

const extId = getExtensionId()
const opHandler = (
    message: any,
    sender: MessageSender,
    sendResponse: (...args: any[]) => void,
) => {
    if (sender.id != extId || !message?.op) {
        return
    }

    switch (message.op) {
        case 'status':
            console.log('[popupService.ts] Popup requested scraper status')
            sendResponse({
                stage: scraper.stage,
                stageProgress: scraper.stageProgress,
                stageTarget: scraper.stageTarget,
            })
            break
        case 'scrape':
            console.log('[popupService.ts] Popup requested scrape')
            window.dispatchEvent(new Event('ck_scrapeMain'))
            sendResponse()
            break
        case 'dataUpdated':
            console.log('[popupService.ts] Popup notified data updated')
            window.dispatchEvent(new Event('ck_dataUpdated'))
            sendResponse()
            break
        default:
            console.error('Unrecognised message: ', message)
            return
    }
}

addRuntimeListener(opHandler)
