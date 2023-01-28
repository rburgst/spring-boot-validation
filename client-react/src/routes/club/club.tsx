import { FC } from 'react'
import { useQuery } from 'react-query'
import { fetchClub } from '../../api/api'
import { Link, useParams } from '@tanstack/react-router'
import { clubEditRoute, clubRoute } from '../../router'

export const ClubPage: FC = () => {
  const { clubId } = useParams({ from: clubRoute.id })
  const { data, error, isLoading } = useQuery(['clubs', clubId], () =>
    fetchClub(clubId)
  )

  return (
    <div>
      <h3>Club Page </h3>
      {isLoading ? <span>Loading…</span> : null}
      {data && (
        <>
          <ul>
            <li>id: {data.id}</li>
            <li>clubName: {data.clubName}</li>
            <li>managerEmail: {data.managerEmail}</li>
          </ul>
          <Link
            to={clubEditRoute.id}
            params={{ clubId: data.id! }}
            search={undefined}
          >
            Edit
          </Link>
        </>
      )}
    </div>
  )
}
