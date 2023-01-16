import { Typography } from "@mui/material";

export default function Info() {
    return (
        <>
            <Typography variant='h4'>What is this?</Typography>
            <Typography variant='body2'>This is a simple p**rogram to process and tag your expenses. Download your .xls file from the bank and upload it here.
            </Typography>
            <ol>
                <li>Create tags (You can put them in series: <small>test1, test2, test3</small> for bulk creating)</li>
                <li>Attach tags to transactions </li>
                <li>See where you spend your money on the chart</li>
            </ol>
            <Typography variant='caption'>This app doesn't store any information about your transactions or any legal information</Typography>
        </>
    )
};