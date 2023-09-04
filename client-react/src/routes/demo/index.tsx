import React, { FC, useState } from 'react'
import { ClubInfo } from '../../model/model'
import { ClubPrimengAutocomplete } from './club-primeng-autocomplete'
import { ClubSelect } from './club-select'
import { ClubAsyncSelect } from './club-async-select'
import { ClubPrimengDropdown } from './club-primeng-dropdown'
import { ClubAsyncSelectPaginate } from './club-async-select-paginate'

export const SearchFieldDemoPage: FC = () => {
  const [selectedClub, setSelectedClub] = useState<ClubInfo | undefined>(
    undefined
  )

  const onClubSelected = (club: ClubInfo | undefined) => {
    setSelectedClub(club)
  }
  return (
    <div>
      <div>club async search</div>

      <ClubAsyncSelectPaginate
        onClubSelected={onClubSelected}
        initialClub={selectedClub}
      />
      <ClubAsyncSelect
        onClubSelected={onClubSelected}
        initialClub={selectedClub}
      />
      <hr></hr>
      <ClubSelect onClubSelected={onClubSelected} initialClub={selectedClub} />
      <div>club search</div>

      <ClubPrimengDropdown
        onClubSelected={onClubSelected}
        initialClub={selectedClub}
      />
      <ClubPrimengAutocomplete
        onClubSelected={onClubSelected}
        initialClub={selectedClub}
      />

      <li>
        selected club: <pre>{JSON.stringify(selectedClub, null, 2)}</pre>
      </li>
    </div>
  )
}
