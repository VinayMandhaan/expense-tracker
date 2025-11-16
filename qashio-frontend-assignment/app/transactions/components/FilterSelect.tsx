import { MenuItem, TextField } from "@mui/material"
import { FilterOption } from "../types"

export function FilterSelect({
    label,
    value,
    options,
    onChange,
    disabled,
}: {
    label: string
    value: string
    options: ReadonlyArray<FilterOption>
    onChange: (value: string) => void
    disabled?: boolean
}) {
    return (
        <TextField
            select
            size="small"
            label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            sx={{ minWidth: 150 }}
        >
            {options.map((option) => (
                <MenuItem key={option.value || 'all'} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    )
}