import React, {
  FC,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ClubInfo, ClubSort, SortCriterium } from '../../model/model'
import { useClubsSearchFieldQuery } from '../../api/api'
import { AutoComplete } from 'primereact/autocomplete'
import { useDebounce } from 'usehooks-ts'
import Select from 'react-select/base'
import {
  ActionMeta,
  components,
  OnChangeValue,
  OptionProps,
} from 'react-select'
import { InputActionMeta } from 'react-select/dist/declarations/src/types'

const defaultSort: SortCriterium<ClubSort> = { column: 'clubName', dir: 'asc' }

const ClubTemplate: FC<OptionProps<ClubInfo, false>> = props => {
  const { data } = props
  return (
    <components.Option {...props}>
      <span>{data.clubName}</span>&nbsp;
      <span>
        <small style={{ color: 'grey' }}>({data.city})</small>
      </span>
    </components.Option>
  )
}

interface ClubSelectProps {
  onClubSelected?: (club: ClubInfo | undefined) => void
  initialClub?: ClubInfo | undefined
}

export const ClubSelect: FunctionComponent<ClubSelectProps> = ({
  initialClub,
  onClubSelected,
}) => {
  const [selectedClub, setSelectedClub] = useState<ClubInfo | null>(
    initialClub ?? null
  )

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [prevSearchTerm, setPrevSearchTerm] = useState<string>(searchTerm)
  const searchTermDebounced = useDebounce(prevSearchTerm, 300)

  const { data, isLoading } = useClubsSearchFieldQuery<ClubInfo>(
    0,
    20,
    defaultSort,
    {
      clubName: searchTermDebounced,
      managerEmail: null,
    }
  )

  const autoCompleteRef = useRef<AutoComplete>(null)
  const responseClubs = data?._embedded?.clubs
  const [matchedClubs, setMatchedClubs] = useState<ClubInfo[] | undefined>(
    responseClubs ?? []
  )

  useEffect(() => {
    const containsSelectedClub =
      responseClubs?.some(value => value.id === selectedClub?.id) ?? false
    const responsesInclSelected = (
      containsSelectedClub && selectedClub
        ? responseClubs
        : [selectedClub, ...(responseClubs ?? [])]
    )?.filter(isValid)
    setMatchedClubs(responsesInclSelected)
    const haveSearchInput =
      (autoCompleteRef.current?.getInput()?.value?.length ?? 0) > 0
    const haveResponses = (responseClubs?.length ?? 0) > 0

    if (haveResponses && haveSearchInput) {
      autoCompleteRef.current?.show()
    }
  }, [responseClubs])

  const handleSelect = (
    e: OnChangeValue<ClubInfo, false>,
    _meta: ActionMeta<ClubInfo>
  ) => {
    console.log('handleSelect', e, _meta)
    setSelectedClub(e)
    onClubSelected?.(e ?? undefined)
  }

  const handleChangedSearchTerm = (e: string, meta: InputActionMeta) => {
    console.log('handleChangedSearchTerm', e, meta)
    if (meta.action === 'input-change') {
      setSearchTerm(e)
      setPrevSearchTerm(e)
      setSelectedClub(null)
    } else {
      console.log('other action ', meta)
      setSearchTerm(e)
    }
  }

  return (
    <div>
      <ul>
        <li>search term: {searchTerm}</li>
        <li>searchTermDebounced: {searchTermDebounced}</li>
        <li>selected club: {selectedClub?.clubName ?? 'no club selected'}</li>
      </ul>
      <Select
        components={{ Option: ClubTemplate }}
        placeholder={'search club'}
        noOptionsMessage={() => 'no clubs found'}
        value={selectedClub}
        inputValue={searchTerm}
        options={matchedClubs ?? []}
        isLoading={isLoading}
        onChange={handleSelect}
        filterOption={null}
        getOptionValue={it => it.id ?? ''}
        getOptionLabel={it => it.clubName}
        onInputChange={handleChangedSearchTerm}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        menuIsOpen={menuIsOpen}
        autoFocus
        isSearchable={true}
        isClearable={true}
        backspaceRemovesValue={true}
        loadingMessage={() => 'loading clubs...'}
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

function isValid<T>(value: T | null | undefined): value is T {
  return !!value
}
