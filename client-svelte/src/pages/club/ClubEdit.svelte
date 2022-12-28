<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import { fetchClub } from '../../lib/api'
  import ClubForm from '../../lib/components/ClubForm.svelte'

  export let id;

  const queryResult = useQuery(['clubs', id], () => fetchClub(id), {enabled: !!id})
</script>
<h1>Edit Club {id}</h1>
{#if $queryResult.isLoading}
  <span>Loading...</span>
{:else if $queryResult.error}
  <span>An error has occurred: {$queryResult.error.message}</span>
{:else}
  <ClubForm data={$queryResult.data}/>
{/if}


