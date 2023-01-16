import { Stack, TextField, Button, Accordion, AccordionDetails, AccordionSummary, Typography, FormHelperText, Input, InputLabel, Grid } from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import AddIcon from '@mui/icons-material/AddBoxSharp';
import { useState } from "react";

type AddNewTagComponentProps = {
    handleAddTag: (newTag: { name: string, filters: string[] }) => void, tags: {
        name: string;
        filters: string[];
    }[]
}

export default function NewTag({ handleAddTag, tags }: AddNewTagComponentProps) {
    const [formFields, setFormFields] = useState<{ name: string, filters: string[] }>({
        name: '', filters: ['']
    })

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        let data = { ...formFields };
        console.log(event.target.name)
        if (event.target.name === 'tagName') {
            data.name = event.target.value
        } else {
            data.filters[index] = event.target.value;
        }
        setFormFields(data);
    }

    const submit = (e: any) => {
        e.preventDefault();
        if (formFields.name.length < 3) {
            alert("Tag name must not be empty and 3 char length")
        } else if (tags.find((field) => field.name === formFields.name)) {
            alert("Tag name must be uniq. Is allready a tag with this name")
        }
        else {
            const newFormFields = { ...formFields };
            newFormFields.filters.join('')
            alert("Tag has been saved!")
            handleAddTag(newFormFields)
        }
    }

    const addFields = () => {
        const newFormFiels = formFields.filters;
        newFormFiels.push('')
        setFormFields({ ...formFields, filters: newFormFiels })
    }

    const removeFields = (index: number) => {
        let data = { ...formFields };
        data.filters.splice(index, 1)
        setFormFields(data)
    }

    return (
        <Stack spacing={2} >
            <form onSubmit={submit}>
                <Grid container spacing={2}>
                    <Grid xs={8} item >
                        <InputLabel htmlFor="name">Tag Name</InputLabel>
                        <Input name="tagName" onChange={event => handleFormChange(event, 0)} />
                        <FormHelperText id="my-helper-text">The name of category as below.</FormHelperText>
                        <Typography variant="caption">
                            I Will search in merchant name for following string:
                            <b>{formFields.filters.join(', ')}</b>
                        </Typography>
                    </Grid>
                    <Grid xs={4} item>
                        <Stack spacing={2}>
                            {formFields.filters.map((form: string, index: number) => {
                                return (
                                    <Grid alignContent={'center'} alignItems={'center'} container>
                                        <Grid item>
                                            <TextField
                                                name='filters'
                                                placeholder='Filter'
                                                onChange={event => handleFormChange(event, index)}
                                                value={form}
                                            />
                                        </Grid>
                                        <Grid item>
                                            {formFields.filters.length > 1 && < DeleteIcon onClick={() => removeFields(index)} color="primary" fontSize="medium" />}
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </Stack>
                        <AddIcon style={{ margin: 5 }} onClick={addFields} color="primary" fontSize="large" />
                    </Grid>
                </Grid>
                {/* TODO: To create multiple filters dinamicaly add filters */}
                <Button variant="contained" onClick={submit}>Save</Button>
            </form>
            {
                tags.map(({ name, filters }, index) => {
                    return (
                        <Accordion key={name + index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id={name + index}
                            >
                                <Typography variant="h6">{name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="subtitle1">
                                    {filters.length ? filters.join(' ') : 'No filter set for this category'}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
        </Stack >
    )
}