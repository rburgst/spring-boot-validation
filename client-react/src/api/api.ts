import { Club, ClubSort, SortCriterium } from '../model/model'
import { useQuery } from 'react-query'
import { z } from 'zod'

export const ClubFilterSchema = z.object({
  clubName: z.string().nullish().default(null),
  managerEmail: z.string().nullish().default(null),
})

export type ClubFilter = z.infer<typeof ClubFilterSchema>

export interface PageResponseInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export interface ApiResponse<T> {
  _embedded: {
    clubs: T[]
  }
  page: PageResponseInfo
}

export function useClubsQuery(
  pageNum: number,
  pageSize: number,
  sort?: SortCriterium<ClubSort>,
  filter?: ClubFilter
) {
  return useQuery({
    queryKey: ['clubs', { sort, filter, pageNum, pageSize }],
    queryFn: () => fetchClubs(pageNum, pageSize, sort, filter),
  })
}

export function useClubsSearchFieldQuery<T>(
  pageNum: number,
  pageSize: number,
  sort?: SortCriterium<ClubSort>,
  filter?: ClubFilter
) {
  return useQuery({
    queryKey: ['clubsSearchField', { sort, filter, pageNum, pageSize }],
    queryFn: () => fetchClubs<T>(pageNum, pageSize, sort, filter, 'clubInfo'),
  })
}

export async function fetchClubs<T>(
  pageNum: number,
  pageSize: number,
  sort?: SortCriterium<ClubSort>,
  filter?: ClubFilter,
  projectionName?: string
) {
  const queryParams = new URLSearchParams()
  queryParams.append('size', `${pageSize}`)
  queryParams.append('page', `${pageNum}`)
  if (sort) {
    queryParams.append('sort', `${sort.column},${sort.dir}`)
  }
  if (projectionName) {
    queryParams.append('projection', projectionName)
  }
  let key: keyof ClubFilter
  for (key in filter) {
    if (filter?.[key]) {
      queryParams.append(key, filter?.[key] ?? '')
    }
  }
  const result = await fetch(`/api/clubs?${queryParams.toString()}`)
  return await extractJsonOrError<ApiResponse<T>>(result)
}

async function extractJsonOrError<T>(result: Response): Promise<T> {
  let body: any
  try {
    body = await result.json()
  } catch (e) {
    console.error('error extracting error body', e)
  }
  if (!result.ok) {
    throw new Error('Network response was not ok', { cause: body })
  }
  return body as T
}

export async function fetchClub(id: string): Promise<Club> {
  const result = await fetch(`/api/clubs/${id}`)
  return await extractJsonOrError(result)
}

export async function updateClub(club: Club): Promise<Club> {
  const result = await fetch(`/api/clubs/${club.id}`, {
    body: JSON.stringify(club),
    method: 'PUT',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
  })
  return extractJsonOrError(result)
}
