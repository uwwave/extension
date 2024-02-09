import logo from '../../assets/popup/wave_logo.svg'

export const LogoBar = () => {
    return (
        <button
            onClick={() => {
                console.log('Clicked on logo bar, opening uwwave.ca')
                window.open('https://uwwave.ca', '_blank')
            }}
            style={{
                width: '100%',
                padding: '9px',
                cursor: 'pointer',
                background: 'none',
                color: 'inherit',
                border: 'none',
                outline: 'inherit',
            }}
        >
            <img src={logo} alt="Logo" height={24} />
        </button>
    )
}
