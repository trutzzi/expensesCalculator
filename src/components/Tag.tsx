import { Chip } from "@mui/material";

type TagProps = {
    id: number,
    isActive: boolean,
    onClick: () => void,
    selectedTags: any[]
    tag: string
}

export default function Tag({ id, isActive, onClick, selectedTags, tag }: TagProps) {
    return (<Chip
        key={'chip__' + id}
        style={{ marginRight: 5, marginBottom: 10 }}
        color={isActive ? undefined : 'primary'}
        onClick={onClick}
        disabled={!!selectedTags.length && isActive}
        variant={isActive ? 'outlined' : 'filled'}
        label={tag}
    />)
}