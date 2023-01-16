import { Button, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


import { useState } from "react";


interface Props {
    onFileUpload: (file: File) => void;
}

export default function FileUpload(props: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
            props.onFileUpload(e.target.files[0]);
        }
    };

    return (
        selectedFile ? <Typography variant="h6"><div style={{ width: '100px ', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{selectedFile.name}</div></Typography> : <>
            <input
                accept="*"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span" >
                    Upload
                    <CloudUploadIcon />
                </Button>
            </label>
        </>

    );
}