import { FC } from 'react'
import { useQuery } from 'react-query'
import { fetchClub } from '../../api/api'
import { useMatch } from '@tanstack/react-router'
import { clubEditRoute, clubRoute } from '../../main'

export const ClubPage: FC = () => {
  const { params, Link } = useMatch(clubRoute.id)
  const { clubId } = params
  const { data, error, isLoading } = useQuery(['clubs', clubId], () =>
    fetchClub(clubId)
  )

  return (
    <div>
      <h3>Club Page </h3>
      {isLoading && <span>Loading…</span>}
      {data && (
        <>
          <ul>
            <li>id: {data.id}</li>
            <li>clubName: {data.clubName}</li>
            <li>managerEmail: {data.managerEmail}</li>
          </ul>
          <Link to={clubEditRoute.id} params={{ clubId: data.id }}>
            Edit
          </Link>
        </>
      )}
    </div>
  )
}
