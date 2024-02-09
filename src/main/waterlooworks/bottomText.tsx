import logo from '../../assets/waterlooworks/wave_logo_toolbar.png'

export const WaveBottomText = () => {
    return (
        <div className={'bottom-text-box'}>
            <div className={'text-with-logo'}>
                <h2>
                    For advanced usage and options, open the extension popup in
                    the top right corner of your browser.
                </h2>
                <img src={logo} alt="Logo" />
            </div>
        </div>
    )
}
