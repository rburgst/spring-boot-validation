import React, { FC, useState } from 'react'
import { ClubInfo } from '../../model/model'
import { ClubSearch } from './club-search'
import { ClubSelect } from './club-select'

export const SearchFieldDemoPage: FC = () => {
  const [selectedClub, setSelectedClub] = useState<ClubInfo | undefined>(
    undefined
  )

  const onClubSelected = (club: ClubInfo) => {
    setSelectedClub(club)
  }
  return (
    <div>
      <ClubSelect onClubSelected={onClubSelected} initialClub={selectedClub} />

      <li>
        selected club: <pre>{JSON.stringify(selectedClub, null, 2)}</pre>
      </li>
    </div>
  )
}
