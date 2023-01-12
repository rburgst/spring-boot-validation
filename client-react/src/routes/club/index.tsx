import React, { FC } from 'react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useClubsQuery } from '../../api/api'
import { clubsRoute } from '../../router'
import { z } from 'zod'
import { ClubSort } from '../../model/model'

const rowsPerPageOptions = [2, 5, 10, 20]

export const ClubPageSearchParams = z.object({
  pageNum: z.number().optional().default(0),
  pageSize: z.number().optional().default(5),
  sort: z.string().optional().default('clubName'),
  dir: z.enum(['asc', 'desc']).optional().default('asc'),
})

export const ClubListPage: FC = () => {
  const search = useSearch({ from: clubsRoute.id, strict: true })
  const { data, error, isLoading } = useClubsQuery(
    search.pageNum,
    search.pageSize,
    [search.sort as ClubSort, search.dir],
    undefined
  )
  const clubs = data?._embedded?.clubs
  const rows = search.pageSize
  const first =
    (data?.page?.number ?? 0) * (data?.page?.size ?? search.pageSize)
  const navigate = useNavigate({ from: clubsRoute.id })
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
          onSelectionChange={e => {
            navigate({
              to: '/clubs/$clubId',
              params: { clubId: e.value.id },
            }).catch(console.error)
          }}
          onSort={e => {
            console.log('sort changed', e)
            navigate({
              to: clubsRoute.id,
              search: {
                ...search,
                sort: e.sortField,
                dir: e.sortOrder === 1 ? 'asc' : 'desc',
              },
            }).catch(console.error)
          }}
          onPage={e => {
            console.log('onPage')
            navigate({
              to: clubsRoute.id,
              search: { ...search, pageNum: e.page, pageSize: e.rows },
            }).catch(console.error)
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
          <Column field="id" header="ID" />
          <Column field="clubName" header="Club Name" sortable={true} />
          <Column field="managerEmail" header="managerEmail" sortable={true} />
        </DataTable>
      </>
    </div>
  )
}
