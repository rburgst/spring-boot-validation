import { Club, ClubSort, SortCriterium } from '../model/model'
import { useQuery } from 'react-query'

export interface PageResponseInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export interface ClubsResponse {
  _embedded: {
    clubs: Club[]
  }
  page: PageResponseInfo
}

export function useClubsQuery(
  pageNum: number,
  pageSize: number,
  sort?: SortCriterium<ClubSort>,
  filter?: any
) {
  return useQuery({
    queryKey: ['clubs', { sort, filter, pageNum, pageSize }],
    queryFn: () => fetchClubs(pageNum, pageSize, sort, filter),
  })
}

export async function fetchClubs(
  pageNum: number,
  pageSize: number,
  sort?: SortCriterium<ClubSort>,
  _filter?: any
) {
  const queryParams = new URLSearchParams()
  queryParams.append('size', `${pageSize}`)
  queryParams.append('page', `${pageNum}`)
  if (sort) {
    queryParams.append('sort', `${sort.column},${sort.dir}`)
  }
  const result = await fetch(`/api/clubs?${queryParams.toString()}`)
  return await extractJsonOrError<ClubsResponse>(result)
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
