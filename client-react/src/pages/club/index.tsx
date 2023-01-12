import React, { FC, useState } from 'react'
// import {Club} from '../model/model'
// import {fetchClubs} from '../api/api'
import { useRouter } from '@tanstack/react-router'
import { useQuery } from 'react-query'
import { fetchClubs } from '../../api/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { Club, ClubSort, SortCriterium } from '../../model/model'

function useClubsQuery(
  pageInfo: PagingInfo,
  sort?: SortCriterium<ClubSort>,
  filter?: any
) {
  return useQuery({
    queryKey: ['clubs', { sort: sort, filter: filter, pageInfo }],
    queryFn: ctx => {
      const queryParams = ctx.queryKey[1]
      if (typeof queryParams !== 'object') {
        throw new Error('invalid query params')
      }
      return fetchClubs(
        queryParams.pageInfo.pageNum,
        queryParams.pageInfo.pageSize,
        queryParams.sort,
        queryParams.filter
      )
    },
  })
}

interface PagingInfo {
  pageNum: number
  pageSize: number
}

const rowsPerPageOptions = [2, 5, 10, 20]

export const ClubListPage: FC = () => {
  const [sort, setSort] = useState<SortCriterium<ClubSort>>(['clubName', 'asc'])
  const [pageInfo, setPageInfo] = useState<PagingInfo>({
    pageNum: 0,
    pageSize: 5,
  })

  const { data, error, isLoading } = useClubsQuery(pageInfo, sort)
  const clubs = data?._embedded?.clubs
  const [selectedClub, setSelectedClub] = useState<Club | undefined>(undefined)
  const router = useRouter()
  console.log('got club list', data, sort)
  return (
    <div>
      <>
        <h3>Clubs List!</h3>
        {error && <Message severity={'error'}>{JSON.stringify(error)}</Message>}
        <DataTable
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
            setSort([
              e.sortField as ClubSort,
              e.sortOrder === 1 ? 'asc' : 'desc',
            ])
          }}
          paginator={true}
          rows={data?.page?.totalElements}
          rowsPerPageOptions={rowsPerPageOptions}
          first={
            (data?.page?.number ?? 0) * (data?.page?.size ?? pageInfo.pageSize)
          }
          sortField={sort[0]}
          sortOrder={sort[1] === 'asc' ? 1 : -1}
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
