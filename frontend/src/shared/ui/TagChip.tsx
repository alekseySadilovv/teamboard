import { Chip, type ChipProps } from '@mui/material'

export function TagChip({ tag, ...props }: { tag: string } & Omit<ChipProps, 'label'>) {
  return <Chip label={`#${tag}`} size="small" variant="outlined" {...props} />
}
