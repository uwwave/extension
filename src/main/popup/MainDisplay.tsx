import { JOB_BOARD_SPEC, JobBoard } from '../../lib/jobBoard'

interface IMainDisplayProps {
    jobCount: number
    companyCount: number
    jobBoard: JobBoard
    scrapeButtonText: string
    onScrapeButtonClicked: () => Promise<void>
}

export const MainDisplay = (props: IMainDisplayProps) => {
    const jobBoardText = JOB_BOARD_SPEC[props.jobBoard].name

    return (
        <div
            className="d-flex-center"
            style={{
                padding: '24px 0',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            <button
                onClick={props.onScrapeButtonClicked}
                style={{
                    padding: '10px 30px',
                    cursor: 'pointer',
                    background: 'none',
                    backgroundColor: '#0082D5',
                    color: 'inherit',
                    border: 'none',
                    borderRadius: '40px',
                    outline: 'inherit',
                    marginBottom: '16px',
                }}
            >
                {props.scrapeButtonText}
            </button>
            <h2 style={{ marginBottom: '8px' }}>Scraped Data</h2>
            <div
                className="d-flex-center"
                style={{
                    width: '80%',
                    flexDirection: 'row',
                    marginBottom: '16px',
                }}
            >
                <div
                    className="d-flex-center"
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}
                >
                    <h1>{props.jobCount}</h1>
                    <h2>{jobBoardText} Jobs</h2>
                </div>
                <div
                    className="d-flex-center"
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}
                >
                    <h1>{props.companyCount}</h1>
                    <h2>Companies</h2>
                </div>
            </div>
        </div>
    )
}
