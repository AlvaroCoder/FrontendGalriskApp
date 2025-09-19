import Footer from '@/views/Layouts/Footer'
import TopBar from '@/views/Layouts/TopBar'
import React from 'react'

export default function Layout({
    children
}) {
  return (
    <main className=''>
        <TopBar/>
        <section className='w-full min-h-screen '>
            {children}
        </section>
        <Footer/>
    </main>
  )
};
