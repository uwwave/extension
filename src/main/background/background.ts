import { addSyncStorageListener } from '../browser/storage'
import { updateBadge } from '../common/badge'
import { addRuntimeOnInstalledListener } from '../browser/runtime'
import { createTabWithUrl } from '../browser/tabs'

let heartbeatTimeout = setTimeout(updateBadge, 65000)

addSyncStorageListener(async () => {
    console.log('Sync storage was updated')
    await updateBadge()
    clearTimeout(heartbeatTimeout)
    heartbeatTimeout = setTimeout(updateBadge, 65000)
})

updateBadge().then()

addRuntimeOnInstalledListener(async function (details) {
    const externalUrl = 'https://uwwave.ca/setup'

    if (details.reason === 'install') {
        await createTabWithUrl(externalUrl)
    }
})
