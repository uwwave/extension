import { useDropzone } from 'react-dropzone'
import { useCallback, useMemo } from 'react'

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 8px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
}

const focusedStyle = {
    borderColor: '#2196f3',
}

const acceptStyle = {
    borderColor: '#00e676',
}

const rejectStyle = {
    borderColor: '#ff1744',
}

interface IDropzoneProps {
    onLoadJson: (data: object) => void
}

// JSON only for now
export const StyledDropzone = (props: IDropzoneProps) => {
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = readerEvent => {
                const content = readerEvent.target.result
                const contentObj = JSON.parse(content)
                console.log('file read successful')
                props.onLoadJson(contentObj)
            }
            reader.readAsText(file)
        })
    }, [])

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({ accept: { 'application/json': ['.json'] }, onDrop })

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject],
    )

    return (
        <div className="container" style={{ width: '100%' }}>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p style={{ textAlign: 'center' }}>
                    Import JSON
                    <br />
                    (Drag & Drop)
                </p>
            </div>
        </div>
    )
}
