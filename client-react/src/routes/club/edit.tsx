import React, { FC, ReactNode, useCallback, useRef, useState } from 'react'
import { useMatch } from '@tanstack/react-router'
import { useMutation, useQuery } from 'react-query'
import { fetchClub, updateClub } from '../../api/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Club, ClubSchema } from '../../model/model'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import { clubEditRoute } from '../../router'

export const ClubEditPage: FC = () => {
  const { params } = useMatch({ from: clubEditRoute.id })
  const { clubId } = params
  const { data } = useQuery(
    ['clubs', clubId],
    () => fetchClub(clubId ?? 'N/A'),
    { enabled: !!clubId }
  )

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm({ defaultValues: data, resolver: zodResolver(ClubSchema) })

  const [serverErrors, setServerErrors] = useState<string | undefined>(
    undefined
  )

  const toastRef = useRef<Toast>(null)
  const mutation = useMutation(updateClub, {
    onMutate: _variables => {
      setServerErrors(undefined)
    },
    onSuccess: (result, _variables, _context) => {
      toastRef.current?.show({ severity: 'success', summary: 'Changes saved' })
    },
    onError: (error: any, _variables, _context) => {
      console.log('mutation error', error)
      const errorDetails = error.cause?.errors
      if (errorDetails) {
        Object.keys(errorDetails).forEach(key => {
          setError(key as any, errorDetails[key])
        })
        setServerErrors(errorDetails.message)
        toastRef.current?.show({
          severity: 'error',
          summary: 'Saving failed: ' + errorDetails.message,
        })
      } else {
        toastRef.current?.show({
          severity: 'error',
          summary: 'Saving failed: ' + error.message,
        })
      }
    },
  })

  const doSubmit = useCallback<(club: Club) => void>((vals: any) => {
    console.log('submit values', vals)
    mutation.mutate(vals)
  }, [])

  const getFormErrorMessage = useCallback<(n: string) => ReactNode | undefined>(
    name =>
      errors[name] && <small className="p-error">{errors[name].message}</small>,
    [errors]
  )

  const haveErrors = Object.keys(errors).length > 0
  console.log('form errors', errors)
  return (
    <div>
      <>
        Club Edit {clubId}
        <Toast ref={toastRef} />
        {data && (
          <>
            <Card>
              {haveErrors && (
                <Message
                  severity={'warn'}
                  text={serverErrors ?? 'Please check your input!'}
                />
              )}
              <form
                method={'post'}
                onSubmit={handleSubmit(doSubmit)}
                className="p-fluid"
              >
                <input
                  type={'hidden'}
                  defaultValue={data.id}
                  {...register('id')}
                />
                <fieldset>
                  <div className="field">
                    <label
                      htmlFor={'clubName'}
                      className={classNames({ 'p-error': errors.clubName })}
                    >
                      ClubName
                    </label>
                    <InputText
                      id={'clubName'}
                      defaultValue={data.clubName}
                      {...register('clubName')}
                      className={classNames({ 'p-invalid': !!errors.clubName })}
                    />
                    {getFormErrorMessage('clubName')}
                  </div>
                </fieldset>
                <fieldset>
                  <div className="field">
                    <label
                      htmlFor={'managerEmail'}
                      className={classNames({ 'p-error': errors.managerEmail })}
                    >
                      managerEmail
                    </label>
                    <InputText
                      id={'managerEmail'}
                      defaultValue={data.managerEmail}
                      {...register('managerEmail')}
                      className={classNames({
                        'p-invalid': !!errors.managerEmail,
                      })}
                    />
                    {getFormErrorMessage('managerEmail')}
                  </div>
                </fieldset>
                <Button type={'submit'} disabled={mutation.isLoading}>
                  Save
                </Button>
              </form>
            </Card>
          </>
        )}
      </>
    </div>
  )
}
