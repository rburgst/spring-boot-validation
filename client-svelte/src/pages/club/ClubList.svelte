<script lang='ts'>
  import { useQuery } from '@sveltestack/svelte-query'
  import { fetchClubs } from '../../lib/api'
  import { Link } from 'svelte-navigator'

  const queryResult = useQuery('clubs', fetchClubs)
</script>
<h1>Club List</h1>
{#if $queryResult.isLoading}
  <span>Loading...</span>
{:else if $queryResult.error}
  <span>An error has occurred: {$queryResult.error.message}</span>
{:else}
  <ul>
    {#each $queryResult.data as club}
      <li><Link to={`/clubs/${club.id}`}>{club.clubName}</Link></li>
    {/each}
  </ul>
{/if}
