import React, { FC } from 'react'
import { Column } from 'primereact/column'
import {
  DataTable,
  DataTableFilterMeta,
  DataTableFilterMetaData,
} from 'primereact/datatable'
import { Message } from 'primereact/message'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useClubsQuery, ClubFilter, ClubFilterSchema } from '../../api/api'
import { clubsRoute } from '../../router'
import { z } from 'zod'
import { ClubSchema, ClubSort } from '../../model/model'

const rowsPerPageOptions = [2, 5, 10, 20]

export const ClubPageSearchParams = z.object({
  pageNum: z.number().optional().default(0),
  pageSize: z.number().optional().default(5),
  sort: z
    .object({
      column: ClubSchema.keyof(),
      dir: z.enum(['asc', 'desc']),
    })
    .optional()
    .default({ column: 'clubName', dir: 'asc' }),
  filter: ClubFilterSchema.optional(),
})

function convertToDatatableFilter(filter?: ClubFilter): DataTableFilterMeta {
  const filterResult: DataTableFilterMeta = {}
  if (!filter) {
    return filterResult
  }
  let key: keyof typeof filter
  for (key in filter) {
    filterResult[key] = { value: filter[key] } as DataTableFilterMetaData
  }
  return filterResult
}

function convertDatatableFilterToSearchParams(
  filters: DataTableFilterMeta
): ClubFilter {
  const clubNameFilter = (filters.clubName as DataTableFilterMetaData)?.value
  const managerEmailFilter = (filters.managerEmail as DataTableFilterMetaData)
    ?.value
  return { managerEmail: managerEmailFilter, clubName: clubNameFilter }
}

export const ClubListPage: FC = () => {
  const search = useSearch({ from: clubsRoute.id, strict: true })
  const { data, error, isLoading } = useClubsQuery(
    search.pageNum,
    search.pageSize,
    search.sort,
    search.filter
  )
  const clubs = data?._embedded?.clubs
  const rows = search.pageSize
  const first =
    (data?.page?.number ?? 0) * (data?.page?.size ?? search.pageSize)
  const navigate = useNavigate({ from: clubsRoute.id })
  const queryFilters = convertToDatatableFilter(search.filter)
  console.log('queryFilters', queryFilters)
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
                sort: {
                  column: e.sortField as ClubSort,
                  dir: e.sortOrder === 1 ? 'asc' : 'desc',
                },
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
          sortField={search.sort.column}
          sortOrder={search.sort.dir === 'asc' ? 1 : -1}
          dataKey="id"
          filterDisplay={'row'}
          filters={queryFilters}
          onFilter={e => {
            console.log('filter', e)
            navigate({
              to: clubsRoute.id,
              search: {
                ...search,
                filter: convertDatatableFilterToSearchParams(e.filters),
              },
            }).catch(console.error)
          }}
        >
          <Column field="id" header="ID" />
          <Column
            field="clubName"
            header="Club Name"
            sortable={true}
            filter
            filterPlaceholder="Search by name"
            showFilterMatchModes={false}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="managerEmail"
            header="managerEmail"
            sortable={true}
            filter
            filterPlaceholder="Search by email"
            showFilterMatchModes={false}
            style={{ minWidth: '12rem' }}
          />
        </DataTable>
      </>
    </div>
  )
}
