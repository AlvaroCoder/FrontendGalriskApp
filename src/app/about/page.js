import FeaturesAbout from '@/views/Cards/FeaturesAbout'
import PrincipalCardAbout from '@/views/Cards/PrincipalCardAbout'
import Footer from '@/views/Layouts/Footer'
import TopBarHome from '@/views/Layouts/TopBarHome'
import React from 'react'

export default function Page() {
  return (
    <div className='relative min-h-screen bg-white flex flex-col'>
      <TopBarHome />
      <PrincipalCardAbout />
      <FeaturesAbout/>
      <Footer/>
    </div>
  )
}
