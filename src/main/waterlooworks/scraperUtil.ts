import $ from 'jquery'
import {
    PostingListDataCoop,
    PostingListDataFulltime,
    PostingListDataOther,
    PostingPageData,
} from '../shared/job'
import { HireGraph, CompanyDivisionWorkTermRating } from '../shared/company'
import JSON5 from 'json5'

// Glossary of pages
// Quick search: links to "For My Program", "Applied To", "Shortlist", "Viewed", etc.
// Job board home: page with "search" button and quick search links
// Job postings table: page with table of up to 100 jobs
// Job table row: one row in the job postings table, corresponds to one job
// Job posting: page with the information on a specific job
// Work term rating: sub-page with the information on a company "division"

type FormObj = object

export interface JobBoardHomeScrape {
    reloadQuickSearchAction: string | undefined
    searchAction: string | undefined
}
export interface PostingsTableScrape {
    pageNumber: number
    startCount: number
    endCount: number
    totalCount: number
}

export interface QuickSearchesScrape {
    forMyProgramAction: string | undefined
    viewedAction: string | undefined
}

interface JobTableRowScrapeBase {
    jobId: number
    formObj: FormObj
}
export interface JobTableRowScrapeCoop extends JobTableRowScrapeBase {
    postingListData: PostingListDataCoop
}
export interface JobTableRowScrapeFulltime extends JobTableRowScrapeBase {
    postingListData: PostingListDataFulltime
}
export interface JobTableRowScrapeOther extends JobTableRowScrapeBase {
    postingListData: PostingListDataOther
}

export interface WorkTermRatingButtonScrape {
    reportHolder: string
    reportHolderId: number
    reportHolderField: string
    action: string
}

export function scrapeJobBoardHome(jobBoardHome: any): JobBoardHomeScrape {
    let reloadQuickSearchAction: string | undefined
    $(jobBoardHome)
        .find('script')
        .each(function (index, script) {
            const text = $(script).text()
            const funcIndex = text.indexOf('function reloadQuickSearchCounts')
            if (funcIndex !== -1) {
                const searchStr = 'request.action = '
                const actionIndex = text.indexOf(searchStr, funcIndex)
                const start = text.indexOf('"', actionIndex)
                const end = text.indexOf('"', start + 1)

                reloadQuickSearchAction = text.substring(start + 1, end)
            }
        })
    const searchAction = $(jobBoardHome)
        .find('#widgetSearch input[name="action"]')
        .attr('value')

    return { reloadQuickSearchAction, searchAction }
}

function getActionFromQuickSearchName(
    quickSearches: any,
    identifier: string,
): string | undefined {
    const link = $(quickSearches).find(`tr a:contains("${identifier}")`)
    const onclick = $(link).attr('onclick')
    if (!onclick) {
        return undefined
    }
    const offset = "displayQuickSearch('".length
    const start = onclick.indexOf("displayQuickSearch('") + offset
    const end = onclick.indexOf("'", start)
    return onclick.substring(start, end)
}

export function scrapeQuickSearches(quickSearches: any): QuickSearchesScrape {
    const forMyProgramAction = getActionFromQuickSearchName(
        quickSearches,
        'For My Program',
    )
    const viewedAction = getActionFromQuickSearchName(quickSearches, 'Viewed')

    return { forMyProgramAction, viewedAction }
}

export function scrapePostingsTable(postingsTable: any): PostingsTableScrape {
    const pageNumberElem = $(postingsTable).find('#currentPageff45d44d8af8')
    const pageNumber = Number(pageNumberElem.attr('value'))

    const startCount = Number($(postingsTable).find('#totalOverAllDocs').text())
    const endCount = Number($(postingsTable).find('#totalOverAllPacks').text())

    const totalCount = Number(
        $(postingsTable)
            .find('#postingsTablePlaceholder div.orbis-posting-actions span')
            .eq(0)
            .text(),
    )

    return { pageNumber, startCount, endCount, totalCount }
}

export function computeNumberPostingsToScrape(
    scrape: PostingsTableScrape,
): number {
    return scrape.endCount - scrape.startCount + 1
}

function getJobTableCellValue(
    tableRow: any,
    position: number,
    useDataToTitleAttr: boolean,
): string | undefined {
    if (useDataToTitleAttr) {
        return $(tableRow)
            .find(`td:nth-child(${position})`)
            .attr('data-totitle')
    } else {
        return $(tableRow).find(`td:nth-child(${position})`).text().trim()
    }
}

function getJobTableRowIdAndFormObj(
    tableRow: any,
    jobIdPos: number,
    linkPos: number,
): JobTableRowScrapeBase | undefined {
    // get job ID
    const jobIdStr = getJobTableCellValue(tableRow, jobIdPos, false)
    if (!jobIdStr) {
        return undefined
    }
    const jobId = Number(jobIdStr)

    // get the form data to open the job posting
    const jobTitleLink = $(tableRow).find(`td:nth-child(${linkPos}) a`)
    const onclick = $(jobTitleLink).attr('onclick')
    if (!onclick) {
        return undefined
    }
    const formObjStr = onclick
        .substring(onclick.indexOf('{'), onclick.indexOf('}') + 1)
        .replace(/'/g, '"')
    const formObj = JSON.parse(formObjStr)
    if (!formObj) {
        return undefined
    }

    return { jobId, formObj }
}

export function scrapeJobTableRowCoop(
    tableRow: any,
): JobTableRowScrapeCoop | undefined {
    const baseScrape = getJobTableRowIdAndFormObj(tableRow, 3, 4)
    if (!baseScrape) {
        return undefined
    }
    const { jobId, formObj } = baseScrape

    const postingListData: PostingListDataCoop = {
        jobTitle: getJobTableCellValue(tableRow, 4, true) || '',
        company: getJobTableCellValue(tableRow, 5, true) || '',
        division: getJobTableCellValue(tableRow, 6, true) || '',
        openings: Number(getJobTableCellValue(tableRow, 7, false) || ''),
        internalStatus: getJobTableCellValue(tableRow, 8, false) || '',
        location: getJobTableCellValue(tableRow, 9, false) || '',
        level: getJobTableCellValue(tableRow, 10, false) || '',
        applications: Number(getJobTableCellValue(tableRow, 11, false) || ''),
        deadline: getJobTableCellValue(tableRow, 12, false) || '',
    }

    return { jobId, formObj, postingListData }
}

export function scrapeJobTableRowFulltime(
    tableRow: any,
): JobTableRowScrapeFulltime | undefined {
    const baseScrape = getJobTableRowIdAndFormObj(tableRow, 3, 4)
    if (!baseScrape) {
        return undefined
    }
    const { jobId, formObj } = baseScrape

    const postingListData: PostingListDataFulltime = {
        jobTitle: getJobTableCellValue(tableRow, 4, true) || '',
        company: getJobTableCellValue(tableRow, 5, true) || '',
        division: getJobTableCellValue(tableRow, 6, true) || '',
        positionType: getJobTableCellValue(tableRow, 7, false) || '',
        internalStatus: getJobTableCellValue(tableRow, 8, false) || '',
        city: getJobTableCellValue(tableRow, 9, false) || '',
        deadline: getJobTableCellValue(tableRow, 10, false) || '',
    }

    return { jobId, formObj, postingListData }
}

export function scrapeJobTableRowOther(
    tableRow: any,
): JobTableRowScrapeOther | undefined {
    const baseScrape = getJobTableRowIdAndFormObj(tableRow, 3, 4)
    if (!baseScrape) {
        return undefined
    }
    const { jobId, formObj } = baseScrape

    const postingListData: PostingListDataOther = {
        jobTitle: getJobTableCellValue(tableRow, 4, true) || '',
        company: getJobTableCellValue(tableRow, 5, true) || '',
        division: getJobTableCellValue(tableRow, 6, true) || '',
        positionType: getJobTableCellValue(tableRow, 7, false) || '',
        internalStatus: getJobTableCellValue(tableRow, 8, false) || '',
        location: getJobTableCellValue(tableRow, 9, false) || '',
        city: getJobTableCellValue(tableRow, 10, false) || '',
        deadline: getJobTableCellValue(tableRow, 11, false) || '',
    }

    return { jobId, formObj, postingListData }
}

export function scrapeJobPostingPage(jobPosting: any): PostingPageData {
    const data: PostingPageData = {}

    function processTableRow(
        index: number,
        tr: any,
    ): { key: string; val: string } | null {
        let key = $(tr).find('td:nth-child(1) strong').first().text().trim()
        // remove colon
        if (key.indexOf(':') !== -1) {
            key = key.substring(0, key.indexOf(':'))
        }
        const content = $(tr).find('td:nth-child(2) span')
        if (content.length > 0) {
            return { key, val: content.html().trim() }
        }

        const contentPlain = $(tr).find('td:nth-child(2)')
        if (contentPlain.length > 0) {
            return { key, val: contentPlain.html().trim() }
        }

        const contentTable = $(tr).find('td:nth-child(2) table')
        if (contentTable.length > 0) {
            const value: string[] = []
            contentTable.find('tbody tr').each(function (index, subTr) {
                $(subTr)
                    .find('td')
                    .each(function (index, subTd) {
                        value.push($(subTd).text().trim())
                    })
            })
            return { key, val: value.join(', ') }
        }

        return null
    }

    const postingDiv = $(jobPosting).find('#postingDiv')
    postingDiv.find('> div').each(function (index, div) {
        const header = $(div).find('> div').eq(0).text().trim()
        $(div)
            .find('div > table > tbody > tr')
            .each(function (index, tr) {
                const pair = processTableRow(index, tr)
                if (pair) {
                    if (!(header in data)) {
                        data[header] = {}
                    }
                    data[header][pair.key] = pair.val
                }
            })
    })

    return data
}

export function scrapeJobPostingForWtrButtonAction(
    jobPosting: any,
): FormObj | undefined {
    const workTermRatingButton = $(jobPosting)
        .find('ul.nav-pills li')
        .last()
        .find('a')[0]
    const onclick = $(workTermRatingButton).attr('onclick')
    if (onclick === undefined) {
        return
    }
    const formObjStr = onclick
        .substring(onclick.indexOf('{'), onclick.indexOf('}') + 1)
        .replace(/'/g, '"')
    return JSON.parse(formObjStr)
}

function readVariableSingleQuote(text: string, searchStr: string): string {
    var actionIndex = text.indexOf(searchStr)
    if (actionIndex !== -1) {
        actionIndex += searchStr.length
        const start = text.indexOf("'", actionIndex)
        const end = text.indexOf("'", start + 1)
        return text.substring(start + 1, end).trim()
    } else {
        return ''
    }
}

export function scrapeWorkTermRatingButton(
    wtrButton: any,
): WorkTermRatingButtonScrape | undefined {
    let reportHolder
    let reportHolderId: number | undefined
    let reportHolderField
    let workTermRatingAction

    $(wtrButton)
        .find('ul.nav-pills')
        .siblings('script')
        .each(function (index, script) {
            const text = $(script).text()
            const holderTemp = readVariableSingleQuote(
                text,
                'reportParams.reportHolder = ',
            )
            if (holderTemp) {
                reportHolder = holderTemp
            }
            const holderIdTemp = readVariableSingleQuote(
                text,
                'reportParams.reportHolderId = ',
            )
            if (holderIdTemp) {
                reportHolderId = Number(holderIdTemp)
            }
            const holderFieldTemp = readVariableSingleQuote(
                text,
                'reportParams.reportHolderField = ',
            )
            if (holderFieldTemp) {
                reportHolderField = holderFieldTemp
            }
            const actionTemp = readVariableSingleQuote(text, "'action':")
            if (actionTemp) {
                workTermRatingAction = actionTemp
            }
        })

    if (
        !reportHolder ||
        !reportHolderId ||
        !reportHolderField ||
        !workTermRatingAction
    ) {
        return
    }

    return {
        reportHolder,
        reportHolderId,
        reportHolderField,
        action: workTermRatingAction,
    }
}

export function scrapeWorkTermRating(
    workTermRating: any,
): CompanyDivisionWorkTermRating | undefined {
    const ratingData: CompanyDivisionWorkTermRating = {
        organization: '',
        division: '',
        graphs: [],
        hireHistory: [],
    }
    $(workTermRating)
        .find('div.boxContent > div.row')
        .each((index, dataRow) => {
            if (index === 0) {
                const searchStr = 'Organization:'
                const labelText = $(dataRow).find('div strong').parent().text()
                ratingData.organization = labelText
                    .substring(labelText.indexOf(searchStr) + searchStr.length)
                    .trim()
            } else if (index === 1) {
                const searchStr = 'Division:'
                const labelText = $(dataRow).find('div strong').parent().text()
                const orgAndDiv = labelText
                    .substring(labelText.indexOf(searchStr) + searchStr.length)
                    .trim()
                ratingData.division = orgAndDiv
                    .substring(ratingData.organization.length)
                    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
            } else if (index === 2) {
                ratingData.hireHistory = []
                const hireHistoryHeaders: string[] = []
                const hireHistoryOrganization: string[] = []
                const hireHistoryDivision: string[] = []
                $(dataRow)
                    .find('table thead th')
                    .each((i, dataPoint) => {
                        hireHistoryHeaders.push($(dataPoint).text().trim())
                    })
                $(dataRow)
                    .find('table tbody tr:nth-child(1) td')
                    .each((i, dataPoint) => {
                        hireHistoryOrganization.push($(dataPoint).text().trim())
                    })
                $(dataRow)
                    .find('table tbody tr:nth-child(2) td')
                    .each((i, dataPoint) => {
                        hireHistoryDivision.push($(dataPoint).text().trim())
                    })
                for (var i = 2; i < hireHistoryHeaders.length; i += 1) {
                    ratingData.hireHistory.push({
                        term: hireHistoryHeaders[i],
                        organizationHired: hireHistoryOrganization[i],
                        divisionHired: hireHistoryDivision[i],
                    })
                }
            } else if (index >= 3) {
                $(dataRow)
                    .find('script')
                    .each((i, script) => {
                        const text = $(script).text()
                        const searchStr = 'orbisChart('
                        const start = text.indexOf(searchStr) + searchStr.length
                        const end = text.indexOf(');', start)
                        const objStr = text.substring(start, end)

                        const plotOptionsStart = objStr.indexOf('plotOptions:')
                        const plotOptionsEnd = objStr.indexOf('credits:')

                        const fixed =
                            objStr.substring(0, plotOptionsStart) +
                            objStr.substring(plotOptionsEnd)

                        const graphObj = JSON5.parse(fixed)

                        if (
                            graphObj !== undefined &&
                            graphObj.series !== undefined
                        ) {
                            const title = graphObj.title.text
                                .replace(ratingData.organization, '') // org name
                                .replace(ratingData.division, '') // division name
                                .replace('<br>', ' ') // newlines
                                .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '') // trim non alphanumeric chars

                            const dataObj: HireGraph = {
                                title,
                                series: graphObj.series,
                            }

                            if (
                                graphObj.xAxis !== undefined &&
                                graphObj.xAxis.categories !== undefined
                            ) {
                                dataObj.categories = graphObj.xAxis.categories
                            }

                            ratingData.graphs.push(dataObj)
                        }
                    })
            }
        })

    if (!ratingData.organization) {
        return
    }

    return ratingData
}
