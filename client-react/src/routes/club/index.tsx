import React, { FC, useState } from 'react'
// import {Club} from '../model/model'
// import {fetchClubs} from '../api/api'
import { useQuery } from 'react-query'
import { fetchClubs } from '../../api/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { Club, ClubSort } from '../../model/model'
import { clubsRoute } from '../../router'
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router'

type UseClubsQueryParams = {
  sort: string
  pageNum: number
  pageSize: number
  dir: 'asc' | 'desc'
}

function useClubsQuery(search: UseClubsQueryParams) {
  return useQuery({
    queryKey: ['clubs', search],
    queryFn: ctx => {
      const queryParams = ctx.queryKey[1]!
      if (typeof queryParams !== 'object') {
        throw new Error('invalid query params')
      }
      return fetchClubs(
        queryParams.pageNum,
        queryParams.pageSize,
        queryParams.sort as ClubSort,
        queryParams.dir
      )
    },
  })
}
const rowsPerPageOptions = [2, 5, 10, 20]

export const ClubListPage: FC = () => {
  const navigate = useNavigate({ from: clubsRoute.id })
  const search = useSearch({ from: clubsRoute.id })

  const { data, error, isLoading } = useClubsQuery(search)
  const [selectedClub, setSelectedClub] = useState<Club | undefined>(undefined)
  const router = useRouter()
  console.log("got club list", data)
  return (
    <div>
      <>
        <h3>Clubs List!</h3>
        {error && <Message severity={'error'}>{JSON.stringify(error)}</Message>}
        <DataTable
          value={data}
          responsiveLayout='scroll'
          loading={isLoading}
          selectionMode='single'
          selection={selectedClub}
          onSelectionChange={e => {
            setSelectedClub(e.value)
            router.navigate({ to: '/clubs/$clubId', params: { clubId: e.value.id } })
          }}
          dataKey='id'
        >
          <Column field='id' header='ID'></Column>
          <Column field='clubName' header='Club Name'></Column>
          <Column field='managerEmail' header='managerEmail'></Column>
        </DataTable>
      </>
    </div>
  )
}
