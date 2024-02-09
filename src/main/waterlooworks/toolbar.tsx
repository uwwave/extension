import {
    CompleteAppState,
    CompleteAppStatus,
} from '../common/completeAppStatus'
import { LogoLoader } from '../common/loader'
import logo from '../../assets/waterlooworks/wave_logo_text.svg'

interface IWaveInlineToolbarProps {
    loading: boolean
    completeAppStatus: CompleteAppStatus
    onPrimaryButtonClicked: () => void
}

export const WaveInlineToolbar = (props: IWaveInlineToolbarProps) => {
    const { loading, completeAppStatus, onPrimaryButtonClicked } = props

    let buttonText: string
    switch (completeAppStatus.appState) {
        case CompleteAppState.SETUP:
            buttonText = 'Scrape Jobs'
            break
        case CompleteAppState.SCRAPE_ERROR:
            buttonText = 'Retry'
            break
        case CompleteAppState.DATA_READY_WARNING:
            buttonText = 'Re-scrape Jobs'
            break
        case CompleteAppState.SCRAPE_COMPLETE:
        case CompleteAppState.DATA_READY_OK:
            buttonText = 'Browse Jobs'
            break
        default:
            buttonText = ''
            break
    }
    if (loading) {
        buttonText = ''
    }

    return (
        <div className={'container-box'}>
            <img className={'logo'} src={logo} alt="Logo" height={32} />
            <button
                onClick={onPrimaryButtonClicked}
                className={'main-button'}
                style={{
                    background: completeAppStatus.bgColor,
                    cursor: buttonText ? 'pointer' : 'default',
                }}
                disabled={!buttonText}
            >
                {buttonText || <LogoLoader width={21} darkMode={true} />}
            </button>
            {!loading && (
                <h1>
                    {completeAppStatus.statusMessage}&nbsp;
                    {completeAppStatus.statusMessageLine2}
                </h1>
            )}
        </div>
    )
}
