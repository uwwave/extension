import { WaveColors } from './waveColors'
import { DAYS_TO_STALE_DATA, LocalStorageMetadataKeys } from '../../lib/consts'
import { isScrapeActive, ScraperStatus, ScrapeStage } from './scraperStatus'
import moment from 'moment'
import { getLocalStorage } from '../browser/storage'

export enum CompleteAppState {
    SETUP,
    NOT_ON_WATERLOO_WORKS,
    SCRAPE_ERROR,
    SCRAPE_COMPLETE,
    SCRAPE_IN_PROGRESS,
    DATA_READY_WARNING,
    DATA_READY_OK,
}

export interface CompleteAppStatus {
    appState: CompleteAppState
    bgColor: WaveColors
    statusMessage: string
    statusMessageLine2: string | undefined
}

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

export async function getLastSuccessfulScrapeAt(): Promise<string> {
    return (await getLocalStorage(LocalStorageMetadataKeys.SCRAPE_AT))[
        LocalStorageMetadataKeys.SCRAPE_AT
    ]
}

export function computeCompleteAppStatus(
    lastSuccessfulScrapeAt: string | null,
    jobCount: number,
    scraperStatus: ScraperStatus | null,
    initiatedScrape: boolean,
    isPopup: boolean = true,
): CompleteAppStatus {
    const isDataGood =
        !!lastSuccessfulScrapeAt &&
        moment()
            .utc()
            .subtract(DAYS_TO_STALE_DATA, 'day')
            .isBefore(lastSuccessfulScrapeAt)

    const isOnWaterlooWorks = scraperStatus !== null
    const isScraping = initiatedScrape || isScrapeActive(scraperStatus)

    const dataAvailable = !isScraping && (isDataGood || jobCount > 0)

    let appState: CompleteAppState
    let bgColor: WaveColors
    let statusMessage = ''
    let dataAgeMessage = undefined
    if (dataAvailable) {
        if (isDataGood) {
            appState = CompleteAppState.DATA_READY_OK
            bgColor = WaveColors.GREEN
            statusMessage = `You're all set!`
        } else {
            appState = CompleteAppState.DATA_READY_WARNING
            bgColor = WaveColors.YELLOW
            statusMessage = 'Your jobs list may be out of date.'
        }

        if (lastSuccessfulScrapeAt) {
            dataAgeMessage = `${getTimeDiffString(lastSuccessfulScrapeAt)}`
        }
    } else {
        if (!isOnWaterlooWorks) {
            appState = CompleteAppState.NOT_ON_WATERLOO_WORKS
            bgColor = WaveColors.GREY
            statusMessage = 'Complete setup on WaterlooWorks'
        } else if (!isScraping) {
            appState = CompleteAppState.SETUP
            bgColor = WaveColors.BLUE
            if (isPopup) {
                statusMessage =
                    'Welcome! Click on Scrape Jobs below to begin setup.'
            } else {
                statusMessage =
                    'Thanks for installing! To finish setup, click on the Scrape Jobs button.'
            }
        } else {
            // Scraping, show progress
            if (scraperStatus?.stage === ScrapeStage.failed) {
                appState = CompleteAppState.SCRAPE_ERROR
                bgColor = WaveColors.RED
                statusMessage = `Error! This can happen if you do not have access to jobs.`
            } else if (scraperStatus?.stage === ScrapeStage.finished) {
                appState = CompleteAppState.SCRAPE_COMPLETE
                bgColor = WaveColors.GREEN
                statusMessage = `You're all set! You can now access jobs on UW Wave.`
            } else {
                appState = CompleteAppState.SCRAPE_IN_PROGRESS
                bgColor = WaveColors.BLUE
                statusMessage = `${scraperStatus.stageProgress}/${scraperStatus.stageTarget} `
                switch (scraperStatus?.stage) {
                    case ScrapeStage.standby:
                        // Don't show progress/target when starting
                        statusMessage = 'Starting...'
                        break
                    case ScrapeStage.jobPostings:
                        statusMessage += 'Fetching jobs...'
                        break
                    case ScrapeStage.workTermRatings:
                        statusMessage += 'Fetching company ratings...'
                        break
                    default:
                        statusMessage += '...'
                        break
                }
            }
        }
    }

    return {
        appState,
        bgColor,
        statusMessage,
        statusMessageLine2: dataAgeMessage && `Last scrape: ${dataAgeMessage}`,
    }
}
