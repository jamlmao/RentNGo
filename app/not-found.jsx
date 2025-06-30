import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#E8E0CF] text-[#171716]">
      <div className="mb-6">
        <Image src="/car-man.svg" alt="Not Found" width={180} height={180} />
      </div>
      <h1 className="text-4xl font-bold mb-2 text-[#991B1B]">404 - Page Not Found</h1>
      <p className="mb-6 text-lg text-[#171716] text-center max-w-md">
        Oops! The page you are looking for does not exist or has been moved.<br />
        Let's get you back on track.
      </p>
      <Link href="/">
        <Button className="bg-[#991B1B] text-[#E8E0CF] hover:bg-[#171716] hover:text-[#E8E0CF] px-6 py-2 rounded-md text-lg font-semibold transition-all">
          Go Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;