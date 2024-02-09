import CheckIcon from '@mui/icons-material/Check'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
    CompleteAppState,
    CompleteAppStatus,
} from '../common/completeAppStatus'

interface IStatusHeaderProps {
    completeAppStatus: CompleteAppStatus
}

export const StatusHeader = (props: IStatusHeaderProps) => {
    const { completeAppStatus: status } = props

    const dataStatusStates = [
        CompleteAppState.DATA_READY_OK,
        CompleteAppState.DATA_READY_WARNING,
    ]
    const showDataStatusBar = dataStatusStates.includes(status.appState)

    return (
        <div
            style={{
                backgroundColor: status.bgColor,
                minHeight: '4px',
                width: '100%',
            }}
        >
            {showDataStatusBar ? (
                <div
                    className="d-flex-center"
                    style={{
                        flexDirection: 'row',
                        width: 'calc(100% - 32px)',
                        padding: '8px 20px 8px 12px',
                    }}
                >
                    <div
                        className="d-flex-center"
                        style={{
                            flex: 3,
                            flexDirection: 'column',
                            alignItems: 'start',
                            gap: '4px',
                        }}
                    >
                        <div
                            className="d-flex-center"
                            style={{
                                flexDirection: 'row',
                                gap: '8px',
                            }}
                        >
                            {status.appState ===
                            CompleteAppState.DATA_READY_WARNING ? (
                                <WarningAmberIcon />
                            ) : (
                                <CheckIcon />
                            )}
                            <h3>{status.statusMessage}</h3>
                        </div>
                        <h3 style={{ marginBottom: '4px' }}>
                            {status.statusMessageLine2}
                        </h3>
                    </div>
                    <div
                        className="d-flex-center"
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'end',
                            gap: '8px',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                        onClick={() => {
                            console.log(
                                'Clicked on browser jobs, opening uwwave.ca/jobs',
                            )
                            window.open('https://uwwave.ca', '_blank')
                        }}
                    >
                        <h3>Browse Jobs</h3>
                    </div>
                </div>
            ) : (
                <div
                    className="d-flex-center"
                    style={{
                        padding: '8px',
                    }}
                >
                    <h3>{status.statusMessage}</h3>
                </div>
            )}
        </div>
    )
}
