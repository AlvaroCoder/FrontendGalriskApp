import TopBar from '@/views/Layouts/TopBar'
import React from 'react'

export default function Layout({
    children
}) {
  return (
    <main >
        <TopBar/>
        {children}
    </main>
  )
};
