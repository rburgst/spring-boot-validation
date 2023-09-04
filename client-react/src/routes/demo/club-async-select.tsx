import React, {
  FC,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ClubInfo, ClubSort, SortCriterium } from '../../model/model'
import { fetchClubs, useClubsSearchFieldQuery } from '../../api/api'
import { AutoComplete } from 'primereact/autocomplete'
import { useDebounce } from 'usehooks-ts'
import Select from 'react-select/base'
import {
  ActionMeta,
  components,
  MenuListProps,
  OnChangeValue,
  OptionProps,
} from 'react-select'
import { InputActionMeta } from 'react-select/dist/declarations/src/types'
import AsyncSelect from 'react-select/async'
import { debounce } from 'ts-debounce'

const defaultSort: SortCriterium<ClubSort> = { column: 'clubName', dir: 'asc' }

const debouncedLoadClubsFromServer = debounce(loadClubsFromServer, 300)

interface ClubSelectProps {
  onClubSelected?: (club: ClubInfo | undefined) => void
  initialClub?: ClubInfo | undefined
}

export const ClubAsyncSelect: FunctionComponent<ClubSelectProps> = ({
  initialClub,
  onClubSelected,
}) => {
  const [selectedClub, setSelectedClub] = useState<ClubInfo | null>(
    initialClub ?? null
  )

  const [searchTerm, setSearchTerm] = useState<string>('')
  // const [prevSearchTerm, setPrevSearchTerm] = useState<string>(searchTerm)
  // const searchTermDebounced = useDebounce(prevSearchTerm, 300)

  const handleSelect = (
    e: OnChangeValue<ClubInfo, false>,
    _meta: ActionMeta<ClubInfo>
  ) => {
    console.log('handleSelect', e, _meta)
    setSelectedClub(e)
    onClubSelected?.(e ?? undefined)
  }

  const doLoadClubsFromServer = useCallback(async (inputValue: string) => {
    console.log('doLoadClubsFromServer', inputValue)
    const result = await debouncedLoadClubsFromServer(inputValue)
    return result
  }, [])

  return (
    <div>
      <h3>React-select async</h3>
      <ul>
        <li>searchTermDebounced: {searchTerm}</li>
        <li>selected club: {selectedClub?.clubName ?? 'no club selected'}</li>
      </ul>
      <AsyncSelect
        components={{ MenuList: MenuList }}
        placeholder={'search club'}
        noOptionsMessage={() => 'no clubs found'}
        defaultValue={initialClub}
        filterOption={null}
        getOptionValue={it => it.id ?? ''}
        getOptionLabel={it => it.clubName}
        loadOptions={doLoadClubsFromServer}
        cacheOptions
        defaultOptions
        loadingMessage={() => 'loading clubs...'}
        formatOptionLabel={option => (
          <div>
            {option.clubName} <small>{option.city}</small>
          </div>
        )}
        closeMenuOnSelect={true}
        openMenuOnFocus={true}
        onChange={handleSelect}
      />
      <div>
        search Sel Club:
        {/*<pre>*/}
        {/*  {JSON.stringify(*/}
        {/*    matchedClubs?.map(it => it.clubName),*/}
        {/*    null,*/}
        {/*    2*/}
        {/*  )}*/}
        {/*</pre>*/}
      </div>
    </div>
  )
}

async function loadClubsFromServer(inputValue: string) {
  console.log('loading clubs from server for', inputValue)
  const result = await fetchClubs<ClubInfo>(
    0,
    20,
    defaultSort,
    {
      clubName: inputValue,
      managerEmail: null,
    },
    'clubInfo'
  )
  return result._embedded?.clubs ?? []
}

const menuHeaderStyle = {
  padding: '8px 12px',
  background: 'blue',
  color: 'white',
}

const MenuList: FC<MenuListProps<ClubInfo, false>> = props => {
  const more = /*haveMoreResults ||*/ props.selectProps.options.length === 20
  console.log('MenuList havemore', more, {
    len: props.selectProps.options.length,
    value: props.getValue(),
    opts: props.selectProps.options.map(it => it.clubName),
  })
  return (
    <components.MenuList {...props}>
      {more && (
        <div style={menuHeaderStyle}>
          have more results, please refine search
        </div>
      )}
      {props.children}
    </components.MenuList>
  )
}
