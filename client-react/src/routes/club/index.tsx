import React, { FC, useState } from 'react'
// import {Club} from '../model/model'
// import {fetchClubs} from '../api/api'
import { useQuery } from 'react-query'
import { fetchClubs } from '../../api/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { Club, ClubSort } from '../../model/model'
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { clubsRoute } from '../../router'

function useClubsQuery(search: {
  sort: string
  pageNum: number
  pageSize: number
  dir: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: ['clubs', search],
    queryFn: ctx => {
      const queryParams = ctx.queryKey[1]
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
  const clubs = data?._embedded?.clubs
  const [selectedClub, setSelectedClub] = useState<Club | undefined>(undefined)
  const router = useRouter()
  console.log('got club list', data, search)
  const rows = search.pageSize
  const first =
    (data?.page?.number ?? 0) * (data?.page?.size ?? search.pageSize)
  console.log('render club list', { rows, first })
  return (
    <div>
      <>
        <h3>Clubs List!</h3>
        {error && <Message severity={'error'}>{JSON.stringify(error)}</Message>}
        <DataTable
          lazy={true}
          value={clubs}
          responsiveLayout="scroll"
          loading={isLoading}
          selectionMode="single"
          selection={selectedClub}
          onSelectionChange={e => {
            setSelectedClub(e.value)
            router.navigate({
              to: '/clubs/$clubId',
              params: { clubId: e.value.id },
            })
          }}
          onSort={e => {
            console.log('sort changed', e)
            // FIXME navigate alone does not seem to work in newer versions than tanstack router beta35, see
            // https://github.com/TanStack/router/issues/479
            navigate({
              to: clubsRoute.id,
              search: {
                ...search,
                sort: e.sortField,
                dir: e.sortOrder === 1 ? 'asc' : 'desc',
              },
            }).catch(err => {
              console.error('navigate caught exception', err)
            })
          }}
          onPage={e => {
            console.log('onPage')
            navigate({
              to: clubsRoute.id,
              search: { ...search, pageNum: e.page, pageSize: e.rows },
            })
          }}
          paginator={true}
          rows={rows}
          rowsPerPageOptions={rowsPerPageOptions}
          totalRecords={data?.page.totalElements ?? 0}
          first={first}
          sortField={search.sort}
          sortOrder={search.dir === 'asc' ? 1 : -1}
          dataKey="id"
        >
          <Column field="id" header="ID"></Column>
          <Column field="clubName" header="Club Name" sortable={true}></Column>
          <Column
            field="managerEmail"
            header="managerEmail"
            sortable={true}
          ></Column>
        </DataTable>
      </>
    </div>
  )
}
