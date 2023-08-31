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

const defaultSort: SortCriterium<ClubSort> = { column: 'clubName', dir: 'asc' }

const ClubTemplate: FC<Club> = (club: ClubInfo) => {
  return (
    <div className="p-clearfix">
      <div style={{ fontSize: '18px', float: 'right', margin: '15px 5px 0 0' }}>
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

export const ClubSearch: FunctionComponent<ClubSearchProps> = ({
  initialClub,
  onClubSelected,
}) => {
  const [selectedClub, setSelectedClub] = useState<ClubInfo | null>(
    initialClub ?? null
  )

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [autoCompletionTerm, setAutoCompletionTerm] = useState<string>('')

  const { data } = useClubsSearchFieldQuery<ClubInfo>(0, 20, defaultSort, {
    clubName: autoCompletionTerm,
    managerEmail: null,
  })

  const autoCompleteRef = useRef<AutoComplete>(null)
  const responseClubs = data?._embedded?.clubs
  const [matchedClubs, setMatchedClubs] = useState<ClubInfo[] | undefined>(
    responseClubs ?? []
  )

  useEffect(() => {
    setMatchedClubs(responseClubs ?? [])
    const haveSearchInput =
      (autoCompleteRef.current?.getInput()?.value?.length ?? 0) > 0
    const haveResponses = (responseClubs?.length ?? 0) > 0

    if (haveResponses && haveSearchInput) {
      autoCompleteRef.current?.show()
    }
  }, [responseClubs])

  const handleCompleteMethod = (e: { query: string }) => {
    const query = e.query
    if (query.length > 2 && query !== autoCompletionTerm) {
      setAutoCompletionTerm(query)
    } else {
      setMatchedClubs([...(matchedClubs ?? [])])
    }
  }

  const handleSelect = (e: { value: ClubInfo }) => {
    setSelectedClub(e.value)
    onClubSelected?.(e.value)
  }

  const handleChangedSearchTerm = (e: { value: string | unknown }) => {
    if (typeof e.value === 'string') {
      setSearchTerm(e.value)
      setSelectedClub(null)
    }
  }

  return (
    <div>
      <ul>
        <li>search term: {searchTerm}</li>
        <li>autoCompletionTerm: {autoCompletionTerm}</li>
        <li>selected club: {selectedClub?.clubName ?? 'no club selected'}</li>
      </ul>
      <AutoComplete
        ref={autoCompleteRef}
        value={selectedClub ?? searchTerm}
        dropdown
        autoFocus
        forceSelection
        suggestions={matchedClubs}
        itemTemplate={ClubTemplate}
        completeMethod={handleCompleteMethod}
        dropdownMode="current"
        field="clubName"
        onSelect={handleSelect}
        onChange={handleChangedSearchTerm}
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
