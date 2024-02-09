import { JobBoard } from '../shared/jobBoard'
import { getLocalStorage } from '../browser/storage'
import { JOB_DATA_IDENTIFIERS } from '../shared/job'
import { DIVISION_DATA_IDENTIFIER } from '../shared/company'
import { getJobBoardSetting } from './userPrefs'

export async function getJobCount(): Promise<number> {
    const jobBoard: JobBoard = await getJobBoardSetting()

    const results = await getLocalStorage(null)
    const keys = Object.keys(results).filter(
        key => key.indexOf(JOB_DATA_IDENTIFIERS[jobBoard]) !== -1,
    )
    return keys.length
}

export async function getCompanyCount(): Promise<number> {
    const results = await getLocalStorage(null)
    const keys = Object.keys(results).filter(
        key => key.indexOf(DIVISION_DATA_IDENTIFIER) !== -1,
    )
    return keys.length
}
