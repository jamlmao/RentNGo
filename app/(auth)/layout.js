import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex justify-center pt-20 items-center h-screen'>
      {children}
    </div>
  )
}

export default AuthLayout