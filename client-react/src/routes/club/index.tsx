import React, { FC, useState } from 'react'
import { useQuery } from 'react-query'
import { fetchClubs } from '../../api/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { Club } from '../../model/model'
import { useRouter } from '@tanstack/react-router'

function useClubsQuery() {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: _ctx => fetchClubs(),
  })
}

export const ClubListPage: FC = () => {
  const { data, error, isLoading } = useClubsQuery()
  const [selectedClub, setSelectedClub] = useState<Club | undefined>(undefined)
  const router = useRouter()
  console.log('got club list', data)
  return (
    <div>
      <>
        <h3>Clubs List!</h3>
        {error && <Message severity={'error'}>{JSON.stringify(error)}</Message>}
        <DataTable
          value={data}
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
          dataKey="id"
        >
          <Column field="id" header="ID"></Column>
          <Column field="clubName" header="Club Name"></Column>
          <Column field="managerEmail" header="managerEmail"></Column>
        </DataTable>
      </>
    </div>
  )
}
