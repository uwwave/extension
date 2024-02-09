import $ from 'jquery'
import { ExtensionResource, getResourceUrl } from '../browser/runtime'
import { ScraperStatus, ScrapeStage } from '../common/scraperStatus'
import { createRoot } from 'react-dom/client'
import { scraper } from './scraper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    CompleteAppState,
    CompleteAppStatus,
    computeCompleteAppStatus,
    getLastSuccessfulScrapeAt,
} from '../common/completeAppStatus'
import { getJobCount } from '../common/dataCounts'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { WaveInlineToolbar } from './toolbar'
import { WaveBottomText } from './bottomText'

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

const scrapeStates = [
    CompleteAppState.SETUP,
    CompleteAppState.SCRAPE_ERROR,
    CompleteAppState.DATA_READY_WARNING,
]
const doneStates = [
    CompleteAppState.DATA_READY_OK,
    CompleteAppState.SCRAPE_COMPLETE,
]

const MainContainer = () => {
    const [stage, setStage] = useState(ScrapeStage.standby)
    const [stageProgress, setStageProgress] = useState(0)
    const [stageTarget, setStageTarget] = useState(1)

    const [jobCount, setJobCount] = useState(0)

    const [loading, setLoading] = useState(true)

    const [lastSuccessfulScrapeAt, setLastSuccessfulScrapeAt] = useState<
        string | null
    >('')

    const [initiatedScrape, setInitiatedScrape] = useState(false)

    const scraperStatus = useMemo<ScraperStatus>(() => {
        return {
            stage,
            stageProgress,
            stageTarget,
        }
    }, [stage, stageProgress, stageTarget])
    const completeAppStatus = useMemo<CompleteAppStatus>(
        () =>
            computeCompleteAppStatus(
                lastSuccessfulScrapeAt,
                jobCount,
                scraperStatus,
                initiatedScrape,
                false,
            ),
        [lastSuccessfulScrapeAt, jobCount, scraperStatus, initiatedScrape],
    )

    const onPrimaryButtonClicked = useCallback(() => {
        if (scrapeStates.includes(completeAppStatus.appState)) {
            setInitiatedScrape(true)
            window.dispatchEvent(new Event('ck_scrapeMain'))
        } else if (doneStates.includes(completeAppStatus.appState)) {
            console.log(
                'complete app status is in a done state, opening uwwave.ca',
            )
            window.open('https://uwwave.ca/jobs', '_blank')
        } else {
            console.log('clicked on primary button while loading, no-op')
        }
    }, [completeAppStatus])

    useEffect(() => {
        const runAsync = async () => {
            setLoading(true)
            await refreshData()
            setLoading(false)
        }
        runAsync().then()
    }, [])

    const onScrapeEvent = () => {
        setStage(ScrapeStage.standby)
        setInitiatedScrape(true)
    }
    const refreshData = async () => {
        setJobCount(await getJobCount())
        setLastSuccessfulScrapeAt(await getLastSuccessfulScrapeAt())
    }

    useEffect(() => {
        scraper.onStatusUpdated = () => {
            setStage(scraper.stage)
            setStageProgress(scraper.stageProgress)
            setStageTarget(scraper.stageTarget)
        }

        window.addEventListener('ck_scrapeStarted', onScrapeEvent)
        window.addEventListener('ck_dataUpdated', refreshData)

        return () => {
            window.removeEventListener('ck_scrapeStarted', onScrapeEvent)
            window.removeEventListener('ck_dataUpdated', refreshData)
        }
    }, [])

    return (
        <ThemeProvider theme={darkTheme}>
            <WaveInlineToolbar
                loading={loading}
                completeAppStatus={completeAppStatus}
                onPrimaryButtonClicked={onPrimaryButtonClicked}
            />
            <WaveBottomText />
        </ThemeProvider>
    )
}

function main() {
    $.get(getResourceUrl(ExtensionResource.HelperContainer), function (data) {
        $($.parseHTML(data)).insertBefore($('main .orbisModuleHeader'))

        // Render your React component instead
        const root = createRoot(
            document.getElementById('ck_content_container') as HTMLElement,
        )
        root.render(<MainContainer />)
    })
}

main()
