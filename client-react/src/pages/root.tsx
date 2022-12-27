import { createRouteConfig, Link, Outlet } from '@tanstack/react-router'
import React, { FC } from 'react'
import styles from './root.module.scss'

export const RootLayout: FC = () => {
  return (
    <>
      <header>
        <nav className={styles.headerNav}>
          <Link to={'/'}>Home</Link>
          <Link to={'clubs'}>Clubs</Link>
        </nav>
      </header>
      <hr />
      <Outlet />
    </>
  )
}
