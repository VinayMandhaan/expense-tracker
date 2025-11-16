import type { GridSortModel } from '@mui/x-data-grid';

export function parseSortParam(param: string | null): GridSortModel {
  if (!param) {
    return [{ field: 'date', sort: 'desc' }]
  }
  const parts = param.split(',').filter(Boolean)
  if (parts.length === 0) {
    return []
  }
  return parts.map((part) => {
    const [field, direction] = part.split(':')
    return {
      field,
      sort: direction === 'asc' || direction === 'desc' ? direction : undefined,
    }
  })
}

export function sortModelToString(model: GridSortModel): string {
  const active = model.filter((item) => item.sort)
  return active.map((item) => `${item.field}:${item.sort}`).join(',')
}

export function areSortModelsEqual(a: GridSortModel, b: GridSortModel): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].field !== b[i].field || a[i].sort !== b[i].sort) {
      return false
    }
  }
  return true
}
