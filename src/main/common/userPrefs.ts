import { getSyncStorage } from '../browser/storage'
import { UserSyncStorageKeys } from '../../lib/consts'
import { JobBoard } from '../../lib/jobBoard'
import { TargetSearchAction } from './targetSearchAction'

export const getJobBoardSetting = async () => {
    return (
        Number(
            (
                await getSyncStorage(
                    UserSyncStorageKeys.SETTING_TARGET_JOB_BOARD,
                )
            )[UserSyncStorageKeys.SETTING_TARGET_JOB_BOARD],
        ) || JobBoard.coop
    )
}
export const getTargetSearchActionSetting = async () => {
    return (
        (
            await getSyncStorage(
                UserSyncStorageKeys.SETTING_TARGET_SEARCH_ACTION,
            )
        )[UserSyncStorageKeys.SETTING_TARGET_SEARCH_ACTION] ||
        TargetSearchAction.FOR_MY_PROGRAM
    )
}
