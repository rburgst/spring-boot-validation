import React, { FC } from 'react'
import { useQuery } from 'react-query'
import { fetchClub } from '../../api/api'
import { useMatch } from '@tanstack/react-router'
import { clubEditRoute, clubRoute, clubsRoute } from '../../main'
import {
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  Label,
  Link,
  ObjectPage,
  ObjectStatus,
} from '@ui5/webcomponents-react'
import { defaultCatch } from '../../util/catch'

export const ClubPage: FC = () => {
  const { params, Link } = useMatch(clubRoute.id)
  const { clubId } = params
  const { data, error, isLoading } = useQuery(['clubs', clubId], () =>
    fetchClub(clubId)
  )
  const { navigate } = useMatch(clubRoute.id)

  return (
    <ObjectPage
      headerContent={
        <DynamicPageHeader>
          <FlexBox alignItems="Center" wrap="Wrap">
            <FlexBox direction="Column">
              <Link>+33 6 4512 5158</Link>
              <Link href="mailto:ui5-webcomponents-react@sap.com">
                DeniseSmith@sap.com
              </Link>
              <Link href="https://github.com/SAP/ui5-webcomponents-react">
                https://github.com/SAP/ui5-webcomponents-react
              </Link>
            </FlexBox>
            <FlexBox direction="Column" style={{ padding: '10px' }}>
              <Label>San Jose</Label>
              <Label>California, USA</Label>
            </FlexBox>
          </FlexBox>
        </DynamicPageHeader>
      }
      headerContentPinnable
      headerTitle={
        <DynamicPageTitle
          actions={
            <>
              <Button
                design="Emphasized"
                onClick={() =>
                  navigate({
                    to: clubEditRoute.id,
                    params: { clubId: data?.id },
                  }).catch(defaultCatch)
                }
              >
                Edit
              </Button>
              <Button>Action</Button>
            </>
          }
          breadcrumbs={
            <Breadcrumbs>
              <BreadcrumbsItem>Manager Cockpit</BreadcrumbsItem>
              <BreadcrumbsItem>My Team</BreadcrumbsItem>
              <BreadcrumbsItem>Employee Details</BreadcrumbsItem>
            </Breadcrumbs>
          }
          header={data?.clubName}
          showSubHeaderRight
          subHeader={data?.managerEmail}
        >
          <ObjectStatus state="Success">employed</ObjectStatus>
        </DynamicPageTitle>
      }
    >
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
    </ObjectPage>
  )
}
