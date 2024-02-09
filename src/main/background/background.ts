import { addSyncStorageListener } from '../common/storage'
import { updateBadge } from '../common/icon'
import { addRuntimeOnInstalledListener } from '../common/runtime'
import { createTabWithUrl } from '../common/tabs'

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
