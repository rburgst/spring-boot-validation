<script lang='ts'>
  import { createForm } from 'felte'
  import type { Club } from '../model'
  import { ClubSchema } from '../model'
  import type { ValidatorConfig } from '@felte/validator-zod'
  import { validator } from '@felte/validator-zod'
  import { updateClub } from '../api'
  import { useMutation } from '@sveltestack/svelte-query'
  import { SvelteToast, toast } from '@zerodevx/svelte-toast'

  export let data: Club = {}

  const { form, errors, setErrors } = createForm({
    onSubmit: (values) => {
      console.log('submit form', values)
      doUpload(values)
    },
    extend: validator({ schema: ClubSchema } as ValidatorConfig),
    initialValues: data
  })

  const mutation = useMutation(updateClub, {
    onSuccess: (result, variables, context) => {
      toast.push('Changes Saved')
    },
    onError: (error: any, variables, context) => {
      console.log('mutation error', error)
      const errorDetails = error.cause?.errors
      if (errorDetails) {
        Object.keys(errorDetails).forEach(key => {
          setErrors(key, errorDetails[key].message)
        })
        console.log('got errorDetails', errorDetails)
        toast.push('Saving failed: ' + error.message)
      }
    }
  })

  function doUpload(updatedClub: Club) {
    $mutation.mutate(updatedClub)
  }
</script>

<SvelteToast />
<form method='post' use:form>
  <fieldset>
    <label for='clubName'>Club Name</label>
    <div>
      <input id='clubName' type='text' name='clubName'>
      {#if $errors['clubName']}
        <small class='p-error'>{$errors['clubName'][0]}</small>
      {/if}
    </div>
    <label for='managerEmail'>Manager Email</label>
    <div>
      <input id='managerEmail' type='email' name='managerEmail'>
      {#if $errors['managerEmail']}
        <small class='p-error'>{$errors['managerEmail'][0]}</small>
      {/if}
    </div>
  </fieldset>
  <button type='submit'>Save</button>
</form>

<style>
    .p-error {
        color: red;
    }

    fieldset {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 5px;
    }
</style>
