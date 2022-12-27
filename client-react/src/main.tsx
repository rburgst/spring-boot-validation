import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import {
  createReactRouter,
  createRouteConfig,
  RouterProvider,
} from '@tanstack/react-router'
import { RootLayout } from './pages/root'
import { ClubListPage } from './pages/club'
import { ClubPage } from './pages/club/club'
import { ClubEditPage } from './pages/club/edit'
import { IndexPage } from './pages'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

export const rootRoute = createRouteConfig({
  component: RootLayout,
})

const homeRoute = rootRoute.createRoute({
  path: '/',
  component: IndexPage,
})
const clubsRoute = rootRoute.createRoute({
  path: '/clubs',
  component: ClubListPage,
})
const clubRoute = rootRoute.createRoute({
  path: '/clubs/$clubId',
  component: ClubPage,
})
const clubEditRoute = rootRoute.createRoute({
  path: '/clubs/$clubId/edit',
  component: ClubEditPage,
})

const routeConfig = rootRoute.addChildren([
  clubEditRoute,
  clubRoute,
  clubsRoute,
  homeRoute,
])

const router = createReactRouter({ routeConfig })

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
