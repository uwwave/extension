import { getLocalStorage, setSyncStorageByKey } from '../browser/storage'
import { UserSyncStorageKeys } from '../../lib/consts'

let textFile: string | null = null

export async function exportJSON() {
    const results = await getLocalStorage(null)

    const text = JSON.stringify(results)

    const data = new Blob([text], { type: 'application/json' })

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile)
    }

    // use textFile as href
    textFile = window.URL.createObjectURL(data)

    // click download
    // https://stackoverflow.com/a/21016088
    const link = document.createElement('a')
    link.href = textFile
    link.download = 'ww_data.json'
    link.target = '_blank'
    document.body.appendChild(link)
    window.requestAnimationFrame(function () {
        const event = new MouseEvent('click')
        link.dispatchEvent(event)
        document.body.removeChild(link)
    })
}

export async function clearLastScrapeStatus() {
    await setSyncStorageByKey(UserSyncStorageKeys.LAST_SCRAPE_STATUS, '')
    await setSyncStorageByKey(UserSyncStorageKeys.LAST_SCRAPE_HEARTBEAT_AT, '')
    await setSyncStorageByKey(UserSyncStorageKeys.LAST_SCRAPE_INITIATED_AT, '')
}

// DOES NOT WORK FOR FIREFOX
// this doesn't work, I have tried like 3 times already, and it just doesn't...
// https://discourse.mozilla.org/t/getting-file-from-file-chooser-after-extension-popup-closed/32881
export async function openJsonFilePicker(onLoad: (content: any) => void) {
    const picker = document.createElement('input')
    picker.id = 'uwwave_json'
    picker.type = 'file'
    picker.name = 'name'
    picker.setAttribute('style', 'display: none;')

    picker.addEventListener('change', function (e) {
        // getting a hold of the file reference
        // @ts-ignore TODO remove
        const file = e.target.files[0]

        console.log(e.target)

        // setting up the reader
        const reader = new FileReader()
        reader.readAsText(file)

        // here we tell the reader what to do when it's done reading...
        reader.onload = function (readerEvent) {
            // @ts-ignore TODO remove
            const content = readerEvent.target.result // this is the content!
            // @ts-ignore TODO remove
            const contentObj = JSON.parse(content)

            console.log('Received imported data')
            onLoad(contentObj)
        }
    })

    picker.click()
}
