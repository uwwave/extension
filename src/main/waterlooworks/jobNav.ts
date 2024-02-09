import $ from 'jquery'

const QUERY_PARAM_JOB_ID = 'ck_jobid'

const urlSearchParams = new URLSearchParams(window.location.search)

const jobId = urlSearchParams.get(QUERY_PARAM_JOB_ID)
const urlWithoutQuery = window.location.href.split('?')[0]

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
