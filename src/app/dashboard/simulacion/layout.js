import SideBarNavigation from '@/views/Navigation/SideBarNavigation'
import React from 'react'

export default function RootLayout({children}) {
  return (
      <div className='flex flex-row min-h-screen w-full'>
          <SideBarNavigation/>
          {children}
    </div>
  )
};