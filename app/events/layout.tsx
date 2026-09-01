import Header from '@/components/header';
import React from 'react'

const EventLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full'>
        {children}
    </div>
  )
}

export default EventLayout