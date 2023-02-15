import { FormEventHandler, FunctionComponent } from 'react'
import { ClubFilter } from '../api/api'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import styles from './club-filter-bar.module.scss'

interface ClubFilterBarProps {
  onFilterUpdated: (newFilter: ClubFilter) => void
  clubName?: string
  managerEmail?: string
}

export const ClubFilterBar: FunctionComponent<ClubFilterBarProps> = ({
  onFilterUpdated,
  clubName,
  managerEmail,
}) => {
  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    console.log('onSubmit', e)
    const formData = new FormData(e.target)
    const newFilter = {
      clubName: formData.get('clubName')?.toString() ?? null,
      managerEmail: formData.get('managerEmail')?.toString() ?? null,
    }
    console.log('filter newFilter', newFilter, formData)
    onFilterUpdated(newFilter)
  }
  return (
    <form method={'post'} onSubmit={onSubmit}>
      <div className={styles.filterbar}>
        <label htmlFor="filterClubName">Club Name:</label>
        <InputText
          id="filterClubName"
          name={'clubName'}
          defaultValue={clubName}
        />
        <label htmlFor="filterManagerEmail">Manager Email:</label>
        <InputText
          id="filterManagerEmail"
          name={'managerEmail'}
          defaultValue={managerEmail}
        />
        <Button id={'submit'} type={'submit'}>
          Search
        </Button>
      </div>
    </form>
  )
}
