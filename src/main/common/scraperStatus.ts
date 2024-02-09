export enum ScrapeStage {
    standby,
    jobPostings,
    workTermRatings,
    finished,
    failed,
}

export type ScraperStatus = null | {
    stage: ScrapeStage
    stageProgress: number
    stageTarget: number
}

export const waitingScrapeStages = [
    ScrapeStage.standby,
    ScrapeStage.finished,
    ScrapeStage.failed,
]
export const terminalScrapeStages = [ScrapeStage.finished, ScrapeStage.failed]

export function isScrapeActive(scraperStatus: ScraperStatus) {
    return (
        scraperStatus?.stage !== undefined &&
        !waitingScrapeStages.includes(scraperStatus.stage)
    )
}

export function isScrapeFinished(scraperStatus: ScraperStatus) {
    return (
        scraperStatus?.stage !== undefined &&
        terminalScrapeStages.includes(scraperStatus.stage)
    )
}

export enum ScrapeBadgeStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}
