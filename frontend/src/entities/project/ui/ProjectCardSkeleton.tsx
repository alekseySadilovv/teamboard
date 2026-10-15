import { Card, CardContent, Skeleton, Stack } from '@mui/material'

export function ProjectCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton width={90} />
        </Stack>
        <Skeleton variant="text" sx={{ fontSize: '1.4rem' }} width="70%" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="85%" />
        <Stack direction="row" spacing={0.5} sx={{ mt: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Stack>
        <Skeleton width="40%" sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  )
}
