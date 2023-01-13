import { Button } from "@mui/material";
import { ChangeEventHandler } from "react";

type FileImportProps = {
    onChange: ChangeEventHandler<any>;
}
export default function FileImport({ onChange }: FileImportProps) {

    return (
        <Button variant='text' color='inherit' component="label">
            Select Report
            <input hidden accept="xls/*" multiple type="file" onChange={onChange} />
        </Button>
    );
}