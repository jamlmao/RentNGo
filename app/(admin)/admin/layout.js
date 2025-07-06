import React from 'react'

import { getAdminData } from '@/actions/admin';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from './_components/sidebar';


const AdminLayout = async ({children}) => {
    const adminData = await getAdminData();
    if (!adminData.authorized) {
        return notFound();
    }


    return (
        <div className='h-full'>
            <Header isAdminPage={true} />
            <div className="flex h-full w-56 flex-col top-22 fixed inset-y-0 z-50 left-0">
                <Sidebar />
            </div>
            <main className='md:pl-56 pt-[80px] h-full'>{children}</main>
        </div>
    )
}

export default AdminLayout