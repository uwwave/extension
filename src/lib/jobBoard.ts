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
        name: 'Co-op Cycle',
        url: 'https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/jobs.htm',
    },
    [JobBoard.fulltime]: {
        name: 'Full-time',
        url: 'https://waterlooworks.uwaterloo.ca/myAccount/graduating/jobs.htm',
    },
    [JobBoard.other]: {
        name: 'Other',
        url: 'https://waterlooworks.uwaterloo.ca/myAccount/contract/jobs.htm',
    },
}
