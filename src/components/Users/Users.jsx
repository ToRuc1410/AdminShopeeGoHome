import React from 'react'
import TableComponent from '../TableComponent/TableComponent'

export default function Users() {
  return (
    <div className='px-2'>
      <div className='flex justify-between'>
        <div className='mt-3'>
          <h2 className='text-left pt-4 font-sans text-gray-600'>Quản Lý Người Dùng</h2>
          <div className='h-[2px] w-10px bg-white'></div>
        </div>
        <button className='bg-blue-300 m-3 text-sm rounded-full p-4 '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
          </svg>
        </button>
      </div>
      <TableComponent />
    </div>
  )
}
