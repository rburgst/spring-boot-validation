import { RootLayout } from './routes/root'
import { IndexPage } from './routes'
import { ClubListPage } from './routes/club'
import { z } from 'zod'
import { ClubPage } from './routes/club/club'
import { ClubEditPage } from './routes/club/edit'
import { ReactRouter, RootRoute, Route } from '@tanstack/react-router'

export const rootRoute = new RootRoute({
  component: RootLayout,
})

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})
export const clubsRoute = new Route({
  getParentRoute: () => rootRoute,
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
export const clubRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/clubs/$clubId',
  component: ClubPage,
})
export const clubEditRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/clubs/$clubId/edit',
  component: ClubEditPage,
})

const routeTree = rootRoute.addChildren([
  clubEditRoute,
  clubRoute,
  clubsRoute,
  homeRoute,
])

export const router = new ReactRouter({
  routeTree,
  defaultPendingComponent: () => <div className={`p-2 text-2xl`}>Loading…</div>,
  onRouteChange: () => {},
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
