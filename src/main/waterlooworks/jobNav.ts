import $ from 'jquery'

const QUERY_PARAM_JOB_ID = 'ck_jobid'
const QUERY_PARAM_COMMAND = 'ck_cmd'
const QUERY_PARAM_REDIRECT = 'ck_redirect'

const urlSearchParams = new URLSearchParams(window.location.search)

const jobId = urlSearchParams.get(QUERY_PARAM_JOB_ID)
const urlWithoutQuery = window.location.href.split('?')[0]

// if (jobId && urlSearchParams.get(QUERY_PARAM_REDIRECT) === "coop"
//     && !JOB_BOARD_URLS.includes(urlWithoutQuery)) {
//     // replace old url in history
//     window.location.replace(urlWithoutQuery + "?" + urlSearchParams.toString());
// }

function getUpdatedUrl() {
    const searchParamsStr = urlSearchParams.toString()
    return urlWithoutQuery + (searchParamsStr ? `?${searchParamsStr}` : '')
}

if (jobId) {
    const jobIdField = document.querySelector(
        'form#searchByPostingNumberForm input#postingId',
    )
    if (jobIdField) {
        // on postings home, redirect
        // @ts-ignore jquery .val() doesn't work, use vanilla js .value
        document.querySelector(
            'form#searchByPostingNumberForm input#postingId',
            // @ts-ignore since this is not on the same line
        ).value = jobId

        // consume job id field so that we don't get stuck in redirect loop
        urlSearchParams.delete(QUERY_PARAM_JOB_ID)

        // submit form to redirect
        const searchByPostingNumberForm = $('form#searchByPostingNumberForm')
        searchByPostingNumberForm.prop('action', getUpdatedUrl())
        searchByPostingNumberForm.trigger('submit')
    }
} else {
    // might be on job specific page
    const jobNameElement = $('h1.dashboard-header__profile-information-name')
    if (jobNameElement.length > 0) {
        const pageJobId = jobNameElement.text().split('-')[0].trim()
        if (!isNaN(Number(pageJobId))) {
            // successfully got jobid, on job specific page
            urlSearchParams.set(QUERY_PARAM_JOB_ID, pageJobId)
            history.replaceState({}, '', getUpdatedUrl())
        }
    }
}
