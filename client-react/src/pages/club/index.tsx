import React, { FC, useState } from 'react'
// import {Club} from '../model/model'
// import {fetchClubs} from '../api/api'
import { useMatch, useRouter } from '@tanstack/react-router'
import { useQuery } from 'react-query'
import { ClubsResponse, fetchClubs } from '../../api/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { Club, ClubSort } from '../../model/model'
import { clubRoute, clubsRoute } from '../../main'
import {
  Badge,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  Label,
  Link,
  ObjectPage,
  ObjectPageSection,
  ObjectStatus,
  Title,
} from '@ui5/webcomponents-react'
import { defaultCatch } from '../../util/catch'

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
  const { search, navigate } = useMatch(clubsRoute.id)

  const { data, error, isLoading } = useClubsQuery(search)
  const clubs = data?._embedded?.clubs
  const [selectedClub, setSelectedClub] = useState<Club | undefined>(undefined)
  console.log('render club list data', data, search)
  const rows = search.pageSize
  const first =
    (data?.page?.number ?? 0) * (data?.page?.size ?? search.pageSize)
  console.log('render club list paging', { rows, first })
  const loadingError: any | undefined = error
  return (
    <DynamicPage
      headerContent={
        <DynamicPageHeader>
          <FlexBox wrap="Wrap">
            <FlexBox direction="Column">
              <Label>Location: Warehouse A</Label>
              <Label>Halway: 23L</Label>
              <Label>Rack: 34</Label>
            </FlexBox>
            <span style={{ width: '1rem' }} />
            <FlexBox direction="Column">
              <Label>Availability:</Label>
              <ObjectStatus state="Success">In Stock</ObjectStatus>
            </FlexBox>
          </FlexBox>
        </DynamicPageHeader>
      }
      headerTitle={
        <DynamicPageTitle
          actions={
            <>
              <Button design="Emphasized">Edit</Button>
              <Button design="Transparent">Delete</Button>
              <Button design="Transparent">Copy</Button>
              <Button design="Transparent" icon="action" />
            </>
          }
          breadcrumbs={
            <Breadcrumbs>
              <BreadcrumbsItem>Home</BreadcrumbsItem>
              <BreadcrumbsItem>Page 1</BreadcrumbsItem>
              <BreadcrumbsItem>Page 2</BreadcrumbsItem>
              <BreadcrumbsItem>Page 3</BreadcrumbsItem>
              <BreadcrumbsItem>Page 4</BreadcrumbsItem>
              <BreadcrumbsItem>Page 5</BreadcrumbsItem>
            </Breadcrumbs>
          }
          header={<Title>Club List</Title>}
          navigationActions={
            <>
              <Button design="Transparent" icon="full-screen" />
              <Button design="Transparent" icon="exit-full-screen" />
              <Button design="Transparent" icon="decline" />
            </>
          }
          subHeader={<Label>This is a sub header</Label>}
        >
          <Badge>Status: OK</Badge>
        </DynamicPageTitle>
      }
    >
      {loadingError && (
        <Message severity={'error'}>{JSON.stringify(loadingError)}</Message>
      )}
      <DataTable
        lazy={true}
        value={clubs}
        responsiveLayout="scroll"
        loading={isLoading}
        selectionMode="single"
        selection={selectedClub}
        onSelectionChange={e => {
          setSelectedClub(e.value)
          navigate({
            to: clubRoute.id,
            params: { clubId: e.value.id },
          }).catch(defaultCatch)
        }}
        onSort={e => {
          console.log('sort changed', e)
          // https://github.com/TanStack/router/issues/479
          navigate({
            to: clubsRoute.id,
            search: {
              ...search,
              sort: e.sortField,
              dir: e.sortOrder === 1 ? 'asc' : 'desc',
            },
          }).catch(defaultCatch)
        }}
        onPage={e => {
          console.log('onPage')
          navigate({
            to: clubsRoute.id,
            search: { ...search, pageNum: e.page, pageSize: e.rows },
          }).catch(defaultCatch)
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
    </DynamicPage>
  )
}
