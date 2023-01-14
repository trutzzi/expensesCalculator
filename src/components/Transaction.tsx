import { Card, CardContent, Stack, Typography, CardActions, Grid } from "@mui/material";
import Tag from "./Tag";


type TransactionPops = {
    merchant: any,
    tags: any[],
    handleAddTagToMerchant: Function,
    data: {
        id: number,
        title: string,
        total: number,
        transactions: number
    }
};

export default function Transactions({ data, merchant, tags, handleAddTagToMerchant }: TransactionPops) {
    const renderAddTags = (id: number, selectedTags: string[]) => {
        return tags.map((tag, index: number) => {
            const isActive = selectedTags.indexOf(tag?.name) === -1;
            return <Tag id={id} onClick={() => handleAddTagToMerchant(data.id, tag?.name)} isActive={isActive} tag={tag?.name} selectedTags={selectedTags} />
        })
    };

    return (
        <Card key={'card__' + data.id} variant="elevation" style={{ padding: 10, width: '100%', marginBottom: 25 }}>
            <CardContent>
                <Stack>
                    <Typography variant='h6'>
                        {data.title}
                    </Typography>
                    <Typography variant='subtitle1' color={'green'}>{data.total} RON</Typography>
                    <Typography variant='overline'>{data.transactions} Tranzactii  </Typography>
                </Stack>
            </CardContent>
            <CardActions>
                <Grid>
                    {renderAddTags(data.id, merchant?.tag)}
                </Grid>
            </CardActions>
        </Card >
    )
};