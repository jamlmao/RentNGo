'use client'

import React from 'react'
import { Calendar, LayoutDashboard, Car, Cog } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  
  },
  {
    label: 'Cars',
    icon: Car,
    href: '/admin/cars',
  },
  {
    label: 'Test Drives',
    icon: Calendar,
    href: '/admin/test-drives',
  },
  {
    label: 'Settings',
    icon: Cog,
    href: '/admin/settings',
  }
]





const Sidebar = () => {
  const pathname = usePathname();
  return (
    <>
        <div className="hidden md:flex h-full flex-col overflow-y-auto shadow-sm broder-r bg-[#171716]">
        {routes.map((route) => {
          return (
            <Link 
              href={route.href} 
              key={route.href}
              className={cn(
                "flex items-center gap-x-2 text-[#E8E0CF] text-sm font-medium pl-6 transition-all hover:text-[#171716] hover:bg-[#E8E0CF] hover:text-[#171716] rounded-lg border-r-1 border-r-[#171716] m-1",
                pathname === route.href ? "bg-[#E8E0CF] text-[#171716] rounded-md border-r-1 border-r-[#171716] mt-1" : "text-[#E8E0CF]",
                "h-12"
              )}
            >
             
                <route.icon className='w-5 h-5' />
                {route.label}
              
            </Link>
          )
        })}
          
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#171716] border-t border-[#23272F] flex justify-around items-center h-16">
        {routes.map((route) => {
            return (
              <Link 
                href={route.href} 
                key={route.href}
                className={cn(
                  "flex flex-col items-center justify-center text-[#E8E0CF] text-xs font-medium transition-all flex-1 py-1 m-1 rounded-lg",
                  pathname === route.href 
                    ? "bg-[#E8E0CF] text-[#171716]"
                    : "text-[#E8E0CF]" ,
                    "py-1 flex-1"
                )}
              >
              
                  <route.icon   
                    className={cn(
                      "h-6 w-6 mb-1",
                      pathname === route.href ? "text-[#171716]" : "text-[#E8E0CF]"
                  )} />
                  {route.label}
                
              </Link>
            )
          })}
      </div>
    </>
  )
}

export default Sidebar