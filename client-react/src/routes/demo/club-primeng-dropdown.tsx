import React, {
  FC,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Club, ClubInfo, ClubSort, SortCriterium } from '../../model/model'
import { useClubsSearchFieldQuery } from '../../api/api'
import { AutoComplete } from 'primereact/autocomplete'
import { Dropdown } from 'primereact/dropdown'
import { useDebounce } from 'usehooks-ts'

const defaultSort: SortCriterium<ClubSort> = { column: 'clubName', dir: 'asc' }

const ClubTemplate: FC<Club> = (club: ClubInfo) => {
  return (
    <div className="p-clearfix">
      <div style={{ fontSize: '18px', margin: '15px 5px 0 0' }}>
        <span>{club.clubName}</span>,{' '}
        <span>
          <small>({club.city})</small>
        </span>
      </div>
    </div>
  )
}

interface ClubSearchProps {
  onClubSelected?: (club: ClubInfo) => void
  initialClub?: ClubInfo | undefined
}

export const ClubPrimengDropdown: FunctionComponent<ClubSearchProps> = ({
  initialClub,
  onClubSelected,
}) => {
  const [selectedClub, setSelectedClub] = useState<ClubInfo | null>(
    initialClub ?? null
  )

  const [searchTerm, setSearchTerm] = useState<string>('')
  // const [autoCompletionTerm, setAutoCompletionTerm] = useState<string>('')
  const autoCompletionTerm = useDebounce(searchTerm, 300)

  const { data } = useClubsSearchFieldQuery<ClubInfo>(0, 20, defaultSort, {
    clubName: autoCompletionTerm,
    managerEmail: null,
  })

  const autoCompleteRef = useRef<Dropdown>(null)
  const responseClubs = data?._embedded?.clubs
  const [matchedClubs, setMatchedClubs] = useState<ClubInfo[] | undefined>(
    responseClubs ?? []
  )

  return (
    <div>
      <h3>PrimeReact dropdown</h3>
      <ul>
        <li>search term: {searchTerm}</li>
        <li>autoCompletionTerm: {autoCompletionTerm}</li>
        <li>selected club: {selectedClub?.clubName ?? 'no club selected'}</li>
      </ul>
      <Dropdown
        options={responseClubs}
        itemTemplate={ClubTemplate}
        filter
        filterBy={'clubName'}
        onFilter={event => {
          console.log('onFilter', event)
          setSearchTerm(event.filter)
        }}
        onSelect={event => {
          console.log('onSelect', event)
        }}
        onChange={event => {
          console.log('onChange', event)
        }}
        filterMatchMode="contains"
        optionLabel={'clubName'}
        // completeMethod={handleCompleteMethod}
        // field="clubName"

        // onSelect={handleSelect}
      />
      <div>
        search Sel Club:
        <pre>
          {JSON.stringify(
            matchedClubs?.map(it => it.clubName),
            null,
            2
          )}
        </pre>
      </div>
    </div>
  )
}
