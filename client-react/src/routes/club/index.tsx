import React, { FC, useState } from 'react'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { ClubSort, SortCriterium } from '../../model/model'
import { useNavigate } from '@tanstack/react-router'
import { PagingInfo, useClubsQuery } from '../../api/api'
import { clubsRoute } from '../../router'

const rowsPerPageOptions = [2, 5, 10, 20]

export const ClubListPage: FC = () => {
  const [sort, setSort] = useState<SortCriterium<ClubSort>>(['clubName', 'asc'])
  const [pageInfo, setPageInfo] = useState<PagingInfo>({
    pageNum: 0,
    pageSize: 5,
  })

  const { data, error, isLoading } = useClubsQuery(pageInfo, sort)
  const clubs = data?._embedded?.clubs
  const navigate = useNavigate({ from: clubsRoute.id })
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
          onSelectionChange={e => {
            navigate({
              to: '/clubs/$clubId',
              params: { clubId: e.value.id },
            }).catch(console.error)
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
          <Column field="id" header="ID" />
          <Column field="clubName" header="Club Name" sortable={true} />
          <Column field="managerEmail" header="managerEmail" sortable={true} />
        </DataTable>
      </>
    </div>
  )
}
