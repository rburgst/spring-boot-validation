<script lang="ts">
  import { Link } from 'svelte-navigator'
  import { useQuery } from '@sveltestack/svelte-query'
  import { fetchClub } from '../../lib/api'

  export let id;

  const queryResult = useQuery(['clubs', id], () => fetchClub(id), {enabled: !!id})
</script>
<h1>Single Club {id}</h1>
{#if $queryResult.isLoading}
  <span>Loading...</span>
{:else if $queryResult.error}
  <span>An error has occurred: {$queryResult.error.message}</span>
{:else}
  <ul>
    <li>id: {$queryResult.data.id}</li>
    <li>name: {$queryResult.data.clubName}</li>
    <li>manager email: {$queryResult.data.managerEmail}</li>
  </ul>
{/if}
<Link to={`/clubs/${id}/edit`}>Edit</Link>
