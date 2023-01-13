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
import { z } from 'zod'
import { ThemeProvider } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/AllIcons.js'

export const rootRoute = createRouteConfig({
  component: RootLayout,
})

const homeRoute = rootRoute.createRoute({
  path: '/',
  component: IndexPage,
})
export const clubsRoute = rootRoute.createRoute({
  path: '/clubs',
  component: ClubListPage,
  validateSearch: searchObj =>
    z
      .object({
        pageNum: z.number().optional().default(0),
        pageSize: z.number().optional().default(5),
        sort: z.string().optional().default('clubName'),
        dir: z.enum(['asc', 'desc']).optional().default('asc'),
      })
      .parse(searchObj),
})
export const clubRoute = rootRoute.createRoute({
  path: '/clubs/$clubId',
  component: ClubPage,
})
export const clubEditRoute = rootRoute.createRoute({
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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)
