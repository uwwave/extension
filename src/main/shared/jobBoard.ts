export enum JobBoard {
    coop,
    fulltime,
    other,
}

interface JobBoardSpec {
    name: string
    url: string
}

export const JOB_BOARD_SPEC: { [jobBoard in JobBoard]: JobBoardSpec } = {
    [JobBoard.coop]: {
        name: 'Co-op',
        url: 'https://waterlooworks.uwaterloo.ca/myAccount/co-op/coop-postings.htm',
    },
    [JobBoard.fulltime]: {
        name: 'Full-time',
        url: 'https://waterlooworks.uwaterloo.ca/myAccount/hire-waterloo/full-time-jobs/jobs-postings.htm',
    },
    [JobBoard.other]: {
        name: 'Other',
        url: 'https://waterlooworks.uwaterloo.ca/myAccount/hire-waterloo/other-jobs/jobs-postings.htm',
    },
}

export const JOB_BOARD_URLS = Object.values(JOB_BOARD_SPEC).map(
    spec => spec.url,
)
