import axios, { AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'

export const AXIOS_RETRY_COUNT = 5

export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

axiosRetry(axios, {
    retries: 5,
    retryCondition: () => true,
})

export function getHttp(url: string): Promise<AxiosResponse<any, any>> {
    return axios.get(url)
}

export function sendForm(
    url: string,
    method: string,
    data: object,
): Promise<AxiosResponse<any, any>> {
    const formData = new FormData()

    // Push our data into our FormData object
    for (const [name, value] of Object.entries(data)) {
        formData.append(name, value)
    }

    return axios({
        url,
        method,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}
