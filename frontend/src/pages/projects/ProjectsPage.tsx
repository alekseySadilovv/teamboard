import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Grid, LinearProgress, Pagination, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { ProjectCard, ProjectCardSkeleton, useProjects } from '../../entities/project'
import { PAGE_SIZE, ProjectFiltersPanel, toApiFilters, useProjectFilters } from '../../features/project-filters'
import { pluralize } from '../../shared/lib/format'
import { Appear, EmptyState, ErrorState, PageHeader } from '../../shared/ui'

export function ProjectsPage() {
  const { values, update, reset, isActive } = useProjectFilters()
  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = useProjects(toApiFilters(values))
  const pageCount = data ? Math.ceil(data.total / PAGE_SIZE) : 0

  return (
    <>
      <PageHeader
        title="Проекты"
        subtitle="Найдите команду для своей идеи или присоединитесь к чужой"
        actions={
          <Button component={RouterLink} to="/projects/new" variant="contained" startIcon={<AddIcon />}>
            Разместить идею
          </Button>
        }
      />

      <ProjectFiltersPanel values={values} isActive={isActive} onChange={update} onReset={reset} />

      <Box sx={{ height: 4, mb: 2 }}>{isFetching && !isPending && <LinearProgress />}</Box>

      {isPending ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }, (_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProjectCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={isActive ? <SearchOffIcon fontSize="inherit" /> : undefined}
          title={isActive ? 'Ничего не найдено' : 'Проектов пока нет'}
          description={isActive ? 'Попробуйте изменить запрос или сбросить фильтры' : 'Станьте первым — разместите свою идею'}
          action={
            isActive ? (
              <Button onClick={reset}>Сбросить фильтры</Button>
            ) : (
              <Button component={RouterLink} to="/projects/new" variant="contained">
                Разместить идею
              </Button>
            )
          }
        />
      ) : (
        <>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            Найдено {data.total} {pluralize(data.total, ['проект', 'проекта', 'проектов'])}
          </Typography>
          <Grid container spacing={3} sx={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            {data.items.map((project, index) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Appear index={index}>
                  <ProjectCard project={project} />
                </Appear>
              </Grid>
            ))}
          </Grid>
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={values.page}
                color="primary"
                onChange={(_, page) => {
                  update({ page })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </Box>
          )}
        </>
      )}
    </>
  )
}
