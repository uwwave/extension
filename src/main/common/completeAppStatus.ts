import { WaveColors } from './waveColors'
import {
    AppStatusOverview,
    DataStatus,
    ScrapeStatus,
} from '../shared/userProfile'
import { isScrapeActive, ScraperStatus } from './scraperStatus'
import { warningDataStatuses } from './appStatus'
import { ScrapeStage } from '../waterlooworks/scraper'

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

export function computeCompleteAppStatus(
    appStatus: AppStatusOverview,
    scraperStatus: ScraperStatus,
    initiatedScrape: boolean,
    isPopup: boolean = true,
): CompleteAppStatus {
    const isOnWaterlooWorks = scraperStatus !== null
    const isScraping = initiatedScrape || isScrapeActive(scraperStatus)

    const dataAvailable =
        !isScraping && appStatus.dataStatus !== DataStatus.NO_DATA
    const showDataStatusWarning = warningDataStatuses.includes(
        appStatus.dataStatus,
    )

    let appState: CompleteAppState
    let bgColor: WaveColors
    let statusMessage = ''
    let dataAgeMessage = undefined
    if (dataAvailable) {
        if (showDataStatusWarning) {
            appState = CompleteAppState.DATA_READY_WARNING
            bgColor = WaveColors.YELLOW
            statusMessage = 'Your jobs list may be out of date.'
        } else {
            appState = CompleteAppState.DATA_READY_OK
            bgColor = WaveColors.GREEN
            statusMessage = `You're all set!`
        }
        dataAgeMessage = appStatus.dataAgeMessage
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
