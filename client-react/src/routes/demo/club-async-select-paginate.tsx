import React, { FunctionComponent, useCallback, useState } from 'react'
import { ClubInfo, ClubSort, SortCriterium } from '../../model/model'
import { fetchClubs } from '../../api/api'
import { ActionMeta, OnChangeValue } from 'react-select'
import { debounce } from 'ts-debounce'
import { AsyncPaginate } from 'react-select-async-paginate'

const defaultSort: SortCriterium<ClubSort> = { column: 'clubName', dir: 'asc' }

interface ClubSelectProps {
  onClubSelected?: (club: ClubInfo | undefined) => void
  initialClub?: ClubInfo | undefined
}

export const ClubAsyncSelectPaginate: FunctionComponent<ClubSelectProps> = ({
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

  return (
    <div>
      <h3>React-select async paginate</h3>
      <ul>
        <li>searchTermDebounced: {searchTerm}</li>
        <li>selected club: {selectedClub?.clubName ?? 'no club selected'}</li>
      </ul>
      <AsyncPaginate
        placeholder={'search club'}
        noOptionsMessage={() => 'no clubs found'}
        defaultValue={initialClub}
        filterOption={null}
        getOptionValue={it => it.id ?? ''}
        getOptionLabel={it => it.clubName}
        debounceTimeout={300}
        loadOptions={async (inputValue, loadOptions, additional) => {
          console.log('loadOptions', {
            inputValue: inputValue ?? 'N/A',
            additional,
            loadOptions,
          })
          const pageNum = additional?.page ?? 0
          const result = await loadClubsFromServer(inputValue, pageNum)
          const response = {
            options: result._embedded?.clubs ?? [],
            hasMore: result.page.totalPages > result.page.number,
            additional: {
              page: result.page.number + 1,
            },
          }
          console.log(
            'got response',
            result.page,
            'returning',
            response.additional
          )
          return response
        }}
        autoFocus
        defaultOptions
        loadingMessage={() => 'loading clubs...'}
        formatOptionLabel={option => (
          <div>
            {option.clubName} <small>{option.city}</small>
          </div>
        )}
        closeMenuOnSelect={true}
        openMenuOnFocus={true}
        additional={{ page: 0 }}
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

async function loadClubsFromServer(inputValue: string, page = 0) {
  console.log('loading clubs from server for', inputValue, 'page', page)
  const result = await fetchClubs<ClubInfo>(
    page,
    20,
    defaultSort,
    {
      clubName: inputValue,
      managerEmail: null,
    },
    'clubInfo'
  )
  return result //._embedded?.clubs ?? []
}

const menuHeaderStyle = {
  padding: '8px 12px',
  background: 'blue',
  color: 'white',
}
//
// const MenuList: FC<MenuListProps<ClubInfo, false>> = props => {
//   const more = /*haveMoreResults ||*/ props.selectProps.options.length === 20
//   console.log('MenuList havemore', more, {
//     len: props.selectProps.options.length,
//     value: props.getValue(),
//     opts: props.selectProps.options.map(it => it.clubName),
//   })
//   return (
//     <components.MenuList {...props}>
//       {more && (
//         <div style={menuHeaderStyle}>
//           have more results, please refine search
//         </div>
//       )}
//       {props.children}
//     </components.MenuList>
//   )
// }
