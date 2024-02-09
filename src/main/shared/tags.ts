export const ALL_TAGS_KEY = 'all_tags'

export const JOBS_TO_TAGS_KEY = 'jobs_to_tags'

export const TAG_DATA_IDENTIFIER = 'jobTags_'

export function getJobTagStorageKey(jobID: string) {
    return TAG_DATA_IDENTIFIER + jobID
}
