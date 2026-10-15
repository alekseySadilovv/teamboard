import { forwardRef, type ReactElement, type ReactNode, type Ref } from 'react'
import { Box, Grow, Slide } from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'

export const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface AppearProps {
  index?: number
  children: ReactNode
}

export function Appear({ index = 0, children }: AppearProps) {
  return (
    <Grow in appear timeout={300 + Math.min(index, 8) * 80} style={{ transformOrigin: '50% 0 0' }}>
      <Box sx={{ height: '100%' }}>{children}</Box>
    </Grow>
  )
}
