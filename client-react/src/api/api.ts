import { Club } from '../model/model'

export async function fetchClubs() {
  const result = await fetch('/api/clubs')
  return (await extractJsonOrError<any>(result))._embedded.clubs as Club[]
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
