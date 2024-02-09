import { getSyncStorage } from '../browser/storage'
import { TargetSearchAction, UserSyncStorageKeys } from '../shared/userProfile'
import { JobBoard } from '../shared/jobBoard'

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
