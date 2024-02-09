// copied from website/components/Loader/LogoLoader.tsx
import styled from 'styled-components'

interface ILogoLoader {
    width?: number
    darkMode?: boolean
}

export const LogoLoader = (props: ILogoLoader) => {
    const { width, darkMode } = props
    return (
        <Svg
            width={width ?? 100}
            viewBox="0 56 285.14 285.14"
            darkMode={darkMode ?? false}
        >
            <rect width="285.14" height="285.14" style={{ fill: 'none' }} />
            <path
                d="M5567.26,2484.25h-38.12c-0.47,6.72-5.64,12-12,12s-11.48-5.3-12-12H5467c-0.47,6.72-5.64,12-12,12s-11.48-5.3-12-12l-38.11.5s-0.15,17.32-.15,28.81v7.26c0,9.66,7.22,17.49,16.12,17.49h130.21c8.9,0,16.12-7.83,16.12-17.49,0-.08,0-0.16,0-0.24S5567.26,2504.94,5567.26,2484.25Z"
                transform="translate(-5343.47 -2253.16)"
            />
            <rect
                width="39px"
                height="69px"
                x="0"
                y="216"
                style={{ borderRadius: '15px' }}
                rx="20"
                ry="20"
                className="pillar"
            />
            <rect
                width="39px"
                height="110px"
                x="61"
                y="140"
                style={{ borderRadius: '15px' }}
                rx="20"
                ry="20"
                className="pillar"
            />
            <rect
                width="39px"
                height="70px"
                x="123"
                y="180"
                style={{ borderRadius: '15px' }}
                rx="20"
                ry="20"
                className="pillar"
            />
            <rect
                width="39px"
                height="150px"
                x="185"
                y="110"
                style={{ borderRadius: '15px' }}
                rx="20"
                ry="20"
                className="pillar"
            />
            <rect
                width="39px"
                height="90px"
                x="246"
                y="196"
                style={{ borderRadius: '15px' }}
                rx="20"
                ry="20"
                className="pillar"
            />
        </Svg>
    )
}

interface ISVG {
    darkMode: boolean
}
const Svg = styled.svg<ISVG>`
    & {
        animation: background 1s infinite ease-in-out;
    }

    .pillar {
        animation: background 1s infinite ease-in-out;
    }

    .pillar:nth-of-type(2) {
        animation: waving1 1s infinite ease-in-out;
    }
    .pillar:nth-of-type(3) {
        animation: waving2 1s infinite ease-in-out;
    }
    .pillar:nth-of-type(4) {
        animation: waving3 1s infinite ease-in-out;
    }

    .pillar:nth-of-type(5) {
        animation: waving4 1s infinite ease-in-out;
    }

    .pillar:nth-of-type(6) {
        animation: waving5 1s infinite ease-in-out;
    }

    ${props =>
        props.darkMode
            ? `&& {
    fill: white!important;
  }`
            : ''}

    @keyframes background {
        0%,
        40%,
        100% {
            opacity: ${props => (props.darkMode ? 0.8 : 0.08)};
        }

        70% {
            opacity: ${props => (props.darkMode ? 1 : 0.06)};
        }
    }
    @keyframes waving1 {
        0%,
        75%,
        100% {
            height: 69px;
            transform: translateY(0);
        }
        30% {
            height: 100px;
            transform: translateY(-31px);
        }
    }

    @keyframes waving2 {
        10%,
        85%,
        100% {
            height: 110px;
            transform: translateY(0);
        }
        40% {
            height: 150px;
            transform: translateY(-40px);
        }
    }

    @keyframes waving3 {
        20%,
        90%,
        100% {
            height: 70px;
            transform: translateY(0);
        }
        50% {
            height: 90px;
            transform: translateY(-20px);
        }
    }

    @keyframes waving4 {
        30%,
        90%,
        100% {
            height: 150px;
            transform: translateY(0);
        }
        60% {
            height: 180px;
            transform: translateY(-30px);
        }
    }

    @keyframes waving5 {
        40%,
        100% {
            height: 90px;
            transform: translateY(0);
        }
        70% {
            height: 120px;
            transform: translateY(-31px);
        }
    }
`
