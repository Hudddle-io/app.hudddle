import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface FriendsPaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
  tab: string;  
}

const Pagination: React.FC<FriendsPaginationProps> = ({ totalPages, currentPage, baseUrl, tab }) => {
  return (
    <div className='flex items-center gap-[1.5rem] text-slate-500 font-semibold'>
      <Link href={`${baseUrl}?tab=${tab}&page=${currentPage > 1 ? currentPage - 1 : 1}`}>
        <ChevronLeft />
      </Link>
      {Array.from({ length: totalPages }).map((_, index) => (
        <Link key={index} href={`${baseUrl}?tab=${tab}&page=${index + 1}`}>
          <span className={`${currentPage === index + 1 ? 'inline-grid rounded-full text-custom-purple shadow-lg place-content-center w-10 h-10  bg-purple-100' : 'text-purple-300'}`}>
            {index + 1}
          </span>
        </Link>
      ))}
      <Link href={`${baseUrl}?tab=${tab}&page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}>
        <ChevronRight />
      </Link>
    </div>
  );
}

export default Pagination;
