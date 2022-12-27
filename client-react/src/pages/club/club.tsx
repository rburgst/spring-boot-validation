import { FC } from 'react'
import { useQuery } from 'react-query'
import { fetchClub } from '../../api/api'
import { Link, useParams } from '@tanstack/react-router'

export const ClubPage: FC = () => {
  const { clubId } = useParams()
  const { data, error, isLoading } = useQuery(['clubs', clubId], () => fetchClub(clubId))

  return <div>
    <h3>Club Page </h3>
    {isLoading && <span>Loading…</span>}
    {data && <>
      <ul>
        <li>id: {data.id}</li>
        <li>clubName: {data.clubName}</li>
        <li>managerEmail: {data.managerEmail}</li>
      </ul>
      <Link to={'/clubs/$clubId/edit'} params={{ clubId: data.id }}>Edit</Link>
    </>
    }
  </div>
}
