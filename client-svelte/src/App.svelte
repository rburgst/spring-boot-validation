<script lang='ts'>
  import { Router, Route, Link } from 'svelte-navigator'
  import Home from './pages/Home.svelte'
  import ClubList from './pages/club/ClubList.svelte'
  import SingleClub from './pages/club/SingleClub.svelte'
  import ClubEdit from './pages/club/ClubEdit.svelte'
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'

  const queryClient = new QueryClient()
</script>
<QueryClientProvider client={queryClient}>
  <Router>
    <header>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/clubs'>Clubs</Link>
      </nav>
    </header>
    <main>
      <Route path='/'>
        <Home />
      </Route>
      <Route path='/clubs/*'>
        <Route path='/' component={ClubList} />
        <Route path=':id/edit' component={ClubEdit} />
        <Route path=':id' component={SingleClub} />
      </Route>
    </main>
  </Router>
</QueryClientProvider>
<style>
</style>
