"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs' 
import { Button } from '@/components/ui/button'
import { CircleUserRound, CarFront, Heart, ShieldUser, ArrowBigLeft, Home } from 'lucide-react'
const Header = ({isAdminPage = false}) => {
const isAdmin = false

  
  return (
    <header className="fixed top-0 w-full bg-red-800/90 backdrop-blur-sm border-b-red-800/90 border-shadow-[#E8E0CF] z-50">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={isAdminPage ? '/admin' : '/'} className="flex">
          <Image src="/RentNGo_logo.png" 
            alt="RentNGo Logo" 
            width={500} 
            height={200} 
            className='h-14 w-auto object-contain hover:scale-105 transition-all duration-300'
          />
          {isAdminPage && (
            <span className='text-xs font-semibold'>Admin</span>
          )}
        </Link>

        {/* if admin it will be routed to home instead of the user side buttons*/}
        <div className='flex items-center space-x-4'>
         { isAdminPage ? (
          <Link href={'/'}>
            <Button variant='outline' className='flex items-center gap-2'>
              <Home size={18} />
              <span className='text-sm font-medium hidden md:inline hover:bg-black hover:text-white'>Back to Home</span>
            </Button>
         </Link>
        ) : (
          <SignedIn>
          <Link href={'/reservations'}>
              <Button className='hover:bg-white hover:text-black'>
                <CarFront size={18} />
                <span className='text-sm font-medium hidden md:inline '>My Reservations</span>
              </Button>
          </Link>
         {!isAdmin ? (
              <Link href={'/profile'}>
                  <Button className='hover:bg-white hover:text-black'>
                    <Heart size={18} />
                    <span className='text-sm font-medium hidden md:inline '>Favorites</span>
                  </Button>
              </Link>
          ):(
              <Link href={'/admin'}>
                  <Button className='hover:bg-black hover:text-white'>
                    <ShieldUser size={18} />
                    <span className='text-sm font-medium hidden md:inline '>Admin</span>
                  </Button>
              </Link>
          )}
          
          </SignedIn>
        )}


        <SignedOut>
          <SignInButton forceRedirectUrl='/'>
            <Button variant='ghost' className='text-black hover:bg-black hover:text-white'>SignIn</Button>
          </SignInButton>
        </SignedOut>


        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          />
        </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header
