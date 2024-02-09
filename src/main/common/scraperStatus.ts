import { ScrapeStage } from '../waterlooworks/scraper'

export type ScraperStatus = null | {
    stage: ScrapeStage
    stageProgress: number
    stageTarget: number
}
