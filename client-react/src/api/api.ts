import { Club, ClubSort, SortCriterium } from '../model/model'

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

export async function fetchClubs(
  pageNum: number,
  pageSize: number,
  sort?: ClubSort,
  dir?: 'asc' | 'desc',
  filter?: any
) {
  console.log('fetching clubs', { pageNum, pageSize, sort, dir })
  const queryParams = new URLSearchParams()
  queryParams.append('size', `${pageSize}`)
  queryParams.append('page', `${pageNum}`)
  if (sort) {
    queryParams.append('sort', `${sort},${dir}`)
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
    const error = new Error('Network response was not ok', { cause: body })
    throw error
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
