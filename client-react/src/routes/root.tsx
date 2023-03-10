import { Link, Outlet } from '@tanstack/react-router'
import React, { FC } from 'react'
import styles from './root.module.scss'
import { clubsRoute, rootRoute } from '../router'

export const RootLayout: FC = () => {
  return (
    <>
      <header>
        <nav className={styles.headerNav}>
          <Link to={'/'}>Home</Link>
          <Link to={clubsRoute.id}>Clubs</Link>
        </nav>
      </header>
      <hr />
      <Outlet />
    </>
  )
}
