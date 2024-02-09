import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { updateBadge } from '../common/icon'
import { isScrapeActive, isScrapeFinished } from '../common/util'
import { trySendMessageToActiveTab } from '../browser/tabs'
import {
    AppStatusOverview,
    TargetSearchAction,
    UserSyncStorageKeys,
} from '../shared/userProfile'
import {
    getAppStatus,
    getJobBoardSetting,
    getTargetSearchActionSetting,
} from '../common/appStatus'
import { LogoLoader } from '../common/loader'
import { JobBoard } from '../shared/jobBoard'
import { LogoBar } from './logoBar'
import { ScraperStatus } from '../common/scraperStatus'
import { StatusHeader } from './statusHeader'
import { MainDisplay } from './mainDisplay'
import { AdvancedOptions } from './advancedOptions'
import { getBrowserInfo } from '../browser/runtime'
import { setSyncStorageByKey } from '../browser/storage'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ScrapeStage } from '../waterlooworks/scraper'
import { getCompanyCount, getJobCount } from '../common/dataCounts'
import { computeCompleteAppStatus } from '../common/completeAppStatus'

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

const MainContainer = () => {
    const [loading, setLoading] = useState(true)

    const [isFirefox, setIsFirefox] = useState(false)

    const [appStatus, setAppStatus] = useState<AppStatusOverview>(
        {} as AppStatusOverview,
    )
    const [scraperStatus, setScraperStatus] = useState<ScraperStatus>(null)
    const [jobCount, setJobCount] = useState(0)
    const [companyCount, setCompanyCount] = useState(0)

    const [initiatedScrape, setInitiatedScrape] = useState(false)

    const completeAppStatus = useMemo(
        () =>
            computeCompleteAppStatus(appStatus, scraperStatus, initiatedScrape),
        [appStatus, scraperStatus, initiatedScrape],
    )

    const [jobBoard, setJobBoard] = useState(JobBoard.coop)
    const [targetSearchAction, setTargetSearchAction] = useState(
        TargetSearchAction.FOR_MY_PROGRAM,
    )

    const pollScrapeInterval = useRef(undefined)

    const beginPollingScrapeStatus = () => {
        if (pollScrapeInterval.current) {
            return
        }
        // @ts-expect-error - setInterval returns a number
        pollScrapeInterval.current = setInterval(async () => {
            await updateScraperStatus()
        }, 3000)
    }

    const onScrapeButtonClicked = async () => {
        const isOnWaterlooWorks = scraperStatus !== null
        if (isOnWaterlooWorks) {
            setInitiatedScrape(true)
            if (scraperStatus) {
                setScraperStatus({
                    stage: ScrapeStage.standby,
                    stageProgress: 0,
                    stageTarget: 1,
                })
            }
            await trySendMessageToActiveTab('scrape')
            beginPollingScrapeStatus()
        } else {
            window.open(
                'https://waterlooworks.uwaterloo.ca/waterloo.htm?action=login',
                '_blank',
            )
        }
    }

    const updateUserPreferences = async () => {
        setTargetSearchAction(await getTargetSearchActionSetting())
        setJobBoard(await getJobBoardSetting())
    }

    const updateCountsAndAppStatus = async () => {
        const nextJobCount = await getJobCount()
        setJobCount(nextJobCount)
        setCompanyCount(await getCompanyCount())
        setAppStatus(await getAppStatus(nextJobCount))
    }

    const updateScraperStatus = async () => {
        // Send 'status' to get scraper status
        setScraperStatus(await trySendMessageToActiveTab('status'))
    }

    useEffect(() => {
        const runAsync = async () => {
            setLoading(true)

            try {
                const browserInfo = await getBrowserInfo()
                setIsFirefox(browserInfo.name === 'Firefox')
            } catch (e) {
                setIsFirefox(false)
            }

            await updateUserPreferences()
            await updateCountsAndAppStatus()
            await updateScraperStatus()

            setLoading(false)
        }
        runAsync().then()
    }, [])

    useEffect(() => {
        if (isScrapeActive(scraperStatus)) {
            beginPollingScrapeStatus()
        } else if (isScrapeFinished(scraperStatus)) {
            clearInterval(pollScrapeInterval.current)
        }
    }, [scraperStatus])

    useEffect(() => {
        console.log(scraperStatus)
    }, [scraperStatus])

    return (
        <ThemeProvider theme={darkTheme}>
            <div
                className="d-flex-center"
                style={{
                    color: 'white',
                    flexDirection: 'column',
                }}
            >
                {loading ? (
                    <div className="d-flex-center" style={{ height: '300px' }}>
                        <LogoLoader darkMode={true} />
                    </div>
                ) : (
                    <>
                        <LogoBar />
                        <StatusHeader completeAppStatus={completeAppStatus} />
                        <MainDisplay
                            scrapeButtonText={'Scrape Jobs'}
                            onScrapeButtonClicked={onScrapeButtonClicked}
                            jobCount={jobCount}
                            companyCount={companyCount}
                            jobBoard={jobBoard}
                        />
                        <AdvancedOptions
                            isFirefox={isFirefox}
                            onDataChanged={async () => {
                                await updateCountsAndAppStatus()
                                await trySendMessageToActiveTab('dataUpdated')
                            }}
                            targetSearchAction={targetSearchAction}
                            onTargetSearchActionSelect={async newValue => {
                                setTargetSearchAction(newValue)
                                await setSyncStorageByKey(
                                    UserSyncStorageKeys.SETTING_TARGET_SEARCH_ACTION,
                                    newValue,
                                )
                            }}
                            jobBoard={jobBoard}
                            onJobBoardSelect={async newValue => {
                                setJobBoard(newValue)
                                await setSyncStorageByKey(
                                    UserSyncStorageKeys.SETTING_TARGET_JOB_BOARD,
                                    newValue,
                                )
                                await updateCountsAndAppStatus()
                            }}
                        />
                    </>
                )}
            </div>
        </ThemeProvider>
    )
}

// update badge on open
updateBadge().then()

// Render your React component instead
const root = createRoot(
    document.getElementById('main-container') as HTMLElement,
)
root.render(<MainContainer />)
