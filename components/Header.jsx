import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { CircleUserRound, CarFront, Heart, ShieldUser, ArrowBigLeft } from 'lucide-react'
const Header = async({isAdminPage = false}) => {
const isAdmin = false

  
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50"> 
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={isAdminPage ? '/admin' : '/'}>
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
            <Button>
              <ArrowBigLeft size={18} />
              <span className='text-sm font-medium hidden md:inline'>Back to Home</span>
            </Button>
         </Link>
        ) : (
          <SignedIn>
          <Link href={'/reservations'}>
              <Button variant='outline'>
                <CarFront size={18} />
                <span className='text-sm font-medium hidden md:inline'>My Reservations</span>
              </Button>
          </Link>
         {!isAdmin ? (
              <Link href={'/profile'}>
                  <Button>
                    <CircleUserRound size={18} />
                    <span className='text-sm font-medium hidden md:inline'>Profile</span>
                  </Button>
              </Link>
          ):(
              <Link href={'/admin'}>
                  <Button>
                    <ShieldUser size={18} />
                    <span className='text-sm font-medium hidden md:inline'>Admin</span>
                  </Button>
              </Link>
          )}
          
          </SignedIn>
        )}

        </div>
      </nav>
    </header>
  )
}

export default Header