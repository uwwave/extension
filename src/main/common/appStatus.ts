import moment from 'moment/moment'
import {
    AppStatusOverview,
    BadgeIconName,
    DataStatus,
    DAYS_TO_STALE_DATA,
    LocalStorageMetadataKeys,
    MINUTES_TO_FAILED_SCRAPE,
    ScrapeStatus,
    UserSyncStorageKeys,
} from '../shared/userProfile'
import { getLocalStorage, getSyncStorage } from '../browser/storage'

function getTimeDiffString(timeOld: string) {
    const timeDiffSeconds = moment().utc().diff(timeOld, 'second')
    let timeDiffString
    if (timeDiffSeconds === 1) {
        // 1 s
        timeDiffString = '1 second ago'
    } else if (timeDiffSeconds < 60) {
        // < 1 min in seconds
        timeDiffString = `${moment().utc().diff(timeOld, 'second')} seconds ago`
    } else if (timeDiffSeconds < 119) {
        // 1 min
        timeDiffString = '1 minute ago'
    } else if (timeDiffSeconds < 3600) {
        // < 1 hr in minutes
        timeDiffString = `${moment().utc().diff(timeOld, 'minute')} minutes ago`
    } else if (timeDiffSeconds < 7199) {
        // 1 hr
        timeDiffString = '1 hour ago'
    } else if (timeDiffSeconds < 86400) {
        // < 1 day in hours
        timeDiffString = `${moment().utc().diff(timeOld, 'hour')} hours ago`
    } else if (timeDiffSeconds < 172799) {
        // 1 day
        timeDiffString = '1 day ago'
    } else {
        // >= 2 days
        timeDiffString = `${moment().utc().diff(timeOld, 'day')} days ago`
    }
    return timeDiffString
}

export const warningDataStatuses = [
    DataStatus.STALE_DATA,
    DataStatus.INCOMPLETE_DATA,
]

export async function getAppStatus(
    jobCount: number,
): Promise<AppStatusOverview> {
    const scrapeStatus = (
        await getSyncStorage(UserSyncStorageKeys.LAST_SCRAPE_STATUS)
    )[UserSyncStorageKeys.LAST_SCRAPE_STATUS]

    const lastScrapeAt = (
        await getSyncStorage(UserSyncStorageKeys.LAST_SCRAPE_INITIATED_AT)
    )[UserSyncStorageKeys.LAST_SCRAPE_INITIATED_AT]
    const lastHeartbeatAt = (
        await getSyncStorage(UserSyncStorageKeys.LAST_SCRAPE_HEARTBEAT_AT)
    )[UserSyncStorageKeys.LAST_SCRAPE_HEARTBEAT_AT]

    const lastSuccessfulScrapeAt = (
        await getLocalStorage(LocalStorageMetadataKeys.SCRAPE_AT)
    )[LocalStorageMetadataKeys.SCRAPE_AT]

    // -- data --
    let dataStatus: DataStatus
    let dataAgeMessage = ''
    if (lastSuccessfulScrapeAt) {
        const isStale = moment()
            .utc()
            .subtract(DAYS_TO_STALE_DATA, 'day')
            .isAfter(lastSuccessfulScrapeAt)
        dataStatus = isStale ? DataStatus.STALE_DATA : DataStatus.GOOD_DATA
        dataAgeMessage = `${getTimeDiffString(lastSuccessfulScrapeAt)}`
    } else {
        dataStatus =
            jobCount > 0 ? DataStatus.INCOMPLETE_DATA : DataStatus.NO_DATA
        dataAgeMessage = `Incomplete data`
    }

    // -- error --
    // if lastHeartbeatAt is empty or undefined, will be false
    const isHeartbeatDead =
        lastHeartbeatAt &&
        moment()
            .utc()
            .subtract(MINUTES_TO_FAILED_SCRAPE, 'minute')
            .isAfter(lastHeartbeatAt)

    const scrapeAge = getTimeDiffString(lastScrapeAt)
    let scrapeError = ''
    if (isHeartbeatDead && scrapeStatus === ScrapeStatus.PENDING) {
        scrapeError = `The recent scrape ${scrapeAge} did not finish.`
    } else if (scrapeStatus === ScrapeStatus.FAILED) {
        scrapeError = `The recent scrape ${scrapeAge} failed.`
    }

    // -- badge icon --
    let badgeIcon: BadgeIconName
    if (scrapeError) {
        badgeIcon = BadgeIconName.error
    } else if (scrapeStatus === ScrapeStatus.PENDING) {
        badgeIcon = BadgeIconName.loading
    } else if (warningDataStatuses.includes(dataStatus)) {
        badgeIcon = BadgeIconName.warning
    } else if (dataStatus === DataStatus.GOOD_DATA) {
        badgeIcon = BadgeIconName.ok
    } else {
        badgeIcon = BadgeIconName.blueIcon
    }

    return {
        dataStatus,
        dataAgeMessage,
        badgeIcon,
        scrapeStatus,
        scrapeError,
    }
}
