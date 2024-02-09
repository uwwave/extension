import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { clearLocalStorage, setLocalStorage } from '../browser/storage'
import {
    clearLastScrapeStatus,
    exportJSON,
    openJsonFilePicker,
} from '../common/util'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { TargetSearchAction } from '../shared/userProfile'
import { JobBoard } from '../shared/jobBoard'
import { WaveColors } from '../common/waveColors'

interface IAdvancedOptionsProps {
    isFirefox: boolean
    onDataChanged: () => Promise<void>
    targetSearchAction: TargetSearchAction
    onTargetSearchActionSelect: (newValue: TargetSearchAction) => Promise<void>
    jobBoard: JobBoard
    onJobBoardSelect: (newValue: JobBoard) => Promise<void>
}

export const AdvancedOptions = (props: IAdvancedOptionsProps) => {
    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false)

    const handleTargetSearchActionChange = (event: SelectChangeEvent) => {
        props.onTargetSearchActionSelect(event.target.value).then()
    }

    const handleJobBoardChange = (event: SelectChangeEvent) => {
        props.onJobBoardSelect(event.target.value).then()
    }

    return (
        <>
            <div
                className="d-flex-center"
                style={{
                    justifyContent: 'left',
                    padding: '10px 12px',
                    width: 'calc(100% - 24px)',
                    backgroundColor: WaveColors.DARK_BLUE,
                    cursor: 'pointer',
                }}
                onClick={() => {
                    setIsAdvancedOptionsOpen(!isAdvancedOptionsOpen)
                }}
            >
                {isAdvancedOptionsOpen ? (
                    <ExpandLessIcon />
                ) : (
                    <ExpandMoreIcon />
                )}
                <h3>Advanced Options</h3>
            </div>
            <div
                className="d-flex-center"
                style={{
                    flexDirection: 'column',
                    padding: '18px',
                    paddingTop: '8px',
                    width: 'calc(100% - 36px)',
                    backgroundColor: WaveColors.DARK_BLUE,
                    display: isAdvancedOptionsOpen ? 'flex' : 'none',
                    justifyContent: 'start',
                    minHeight: 0,
                    maxHeight: '200px',
                    overflow: 'auto',
                }}
            >
                <h3 style={{ marginBottom: '12px' }}>Scraped Data</h3>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '5px',
                        width: '100%',
                        marginBottom: '12px',
                    }}
                >
                    {props.isFirefox ? (
                        <div
                            className="d-flex-center"
                            style={{
                                flex: 1,
                                backgroundColor: WaveColors.GREY,
                                borderRadius: 2,
                                height: '40px',
                                textAlign: 'center',
                            }}
                        >
                            <h3>Cannot import on Firefox</h3>
                        </div>
                    ) : (
                        <div
                            className="d-flex-center"
                            style={{
                                flex: 1,
                                backgroundColor: WaveColors.BLUE,
                                borderRadius: 2,
                                height: '40px',
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                openJsonFilePicker(async data => {
                                    console.log('Received imported data')
                                    await clearLocalStorage()
                                    await clearLastScrapeStatus()
                                    await setLocalStorage(data)

                                    await props.onDataChanged()

                                    console.log('Done importing data')
                                })
                            }}
                        >
                            <h3>Import</h3>
                        </div>
                    )}
                    <div
                        className="d-flex-center"
                        style={{
                            flex: 1,
                            backgroundColor: WaveColors.BLUE,
                            borderRadius: 2,
                            height: '40px',
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={async () => {
                            await exportJSON()
                        }}
                    >
                        <h3>Export</h3>
                    </div>
                    <div
                        className="d-flex-center"
                        style={{
                            flex: 1,
                            backgroundColor: WaveColors.BLUE,
                            borderRadius: 2,
                            height: '40px',
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={async () => {
                            await clearLocalStorage()
                            await clearLastScrapeStatus()

                            await props.onDataChanged()
                        }}
                    >
                        <h3>Clear</h3>
                    </div>
                </div>

                <h3 style={{ marginBottom: '12px' }}>Options</h3>
                <FormControl fullWidth style={{ marginBottom: '20px' }}>
                    <InputLabel id="demo-select-small-label">
                        Target Search Action
                    </InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={props.targetSearchAction}
                        label="Target Search Action"
                        onChange={handleTargetSearchActionChange}
                    >
                        <MenuItem value={TargetSearchAction.FOR_MY_PROGRAM}>
                            For My Program
                        </MenuItem>
                        <MenuItem value={TargetSearchAction.DEFAULT_SEARCH}>
                            Default Search
                        </MenuItem>
                        <MenuItem value={TargetSearchAction.VIEWED}>
                            Viewed
                        </MenuItem>
                    </Select>
                    <FormHelperText>
                        The list of jobs from this search will be scraped.
                    </FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="demo-select-small-label">
                        Job Board
                    </InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={props.jobBoard}
                        label="Job Board"
                        onChange={handleJobBoardChange}
                    >
                        <MenuItem value={JobBoard.coop}>Co-op</MenuItem>
                        <MenuItem value={JobBoard.fulltime}>Full-time</MenuItem>
                        <MenuItem value={JobBoard.other}>Other</MenuItem>
                    </Select>
                    <FormHelperText>
                        The job board that will be scraped.
                    </FormHelperText>
                </FormControl>
            </div>
        </>
    )
}
