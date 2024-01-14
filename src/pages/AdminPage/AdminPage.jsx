import React, { useState } from 'react'
// import Header from '../../components/Header/header'

import { NavLink, Outlet } from 'react-router-dom'
import classNames from 'classnames'
import Header from '../../components/Header/Header'

const AdminPage = () => {
  const [isActive, setIsActive] = useState(false)
  const handleCheck = () => {
    setIsActive((prev) => !prev)
  }
  return (
    <div className='w-full h-full'>
      <div className='container'>
        <Header />
        <div className='grid grid-cols-12 '>
          <div className='col-span-2 bg-grown p-4'>
            <div className='ml-8 text-left mt-4'>
              <NavLink
                to='/system/slidesShow'
                className={({ isActive }) =>
                  classNames(
                    ' text-gray-600 px-3 flex hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm',
                    { 'text-blue-500 bg-blue-100': isActive }
                  )
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z'
                  />
                </svg>

                <span>Xem Thông Tin </span>
              </NavLink>
            </div>
            <div className='ml-8 mt-3 text-left'>
              <NavLink
                to='/system/orders'
                className={({ isActive }) =>
                  classNames(
                    ' text-gray-600 hover:bg-blue-200 hover:text-blue-500 py-2 px-1 transition-colors rounded-sm lg:text-sm flex',
                    { 'text-blue-500 bg-blue-100': isActive }
                  )
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4 '
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                <span>Quản Lý Đơn Hàng</span>
              </NavLink>
            </div>
            <button className='cursor-pointer my-5 lg:text-sm ml-2' onClick={handleCheck}>
              <div className='flex text-gray-600 hover:bg-blue-200 hover:text-blue-500 py-2 text-right'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4 ml-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75'
                  />
                </svg>

                <span>Quản Lý Sản Phẩm</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4 mr-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                </svg>
              </div>
              <div className={isActive ? '' : 'hidden'}>
                <NavLink
                  to='/system/categories'
                  className={({ isActive }) =>
                    classNames(
                      ' text-gray-600 float-right flex hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm px-4',
                      { 'text-blue-500 bg-blue-100': isActive }
                    )
                  }
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3' />
                  </svg>
                  <span>Quản Lý Danh Mục</span>
                </NavLink>

                <NavLink
                  to='/system/products'
                  className={({ isActive }) =>
                    classNames(
                      ' text-gray-600 px-4 my-2 flex float-right hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm',
                      { 'text-blue-500 bg-blue-100': isActive }
                    )
                  }
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3' />
                  </svg>
                  <span>Quản Lý Sản Phẩm</span>
                </NavLink>
              </div>
            </button>
            <div className=' ml-8 mt-1 my-5 text-left'>
              <NavLink
                to='/system/users'
                className={({ isActive }) =>
                  classNames(
                    ' text-gray-600 px-1 hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm flex',
                    { 'text-blue-500 bg-blue-100': isActive }
                  )
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                <span>Quản Lý Người Dùng</span>
              </NavLink>
            </div>
            <div className='ml-8 text-left mt-4'>
              <NavLink
                to='/system/categoryBlog'
                className={({ isActive }) =>
                  classNames(
                    ' text-gray-600 px-3 flex hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm',
                    { 'text-blue-500 bg-blue-100': isActive }
                  )
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75'
                  />
                </svg>

                <span>Quản Lý Tin Tức</span>
              </NavLink>
            </div>
            <div className='ml-8 text-left mt-4'>
              <NavLink
                to='/system/reviewOrder'
                className={({ isActive }) =>
                  classNames(
                    ' text-gray-600 px-3 flex hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm',
                    { 'text-blue-500 bg-blue-100': isActive }
                  )
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3' />
                </svg>
                <span>Đánh Giá Sản Phẩm</span>
              </NavLink>
            </div>
          </div>
          <div className='col-span-10 bg-gray-300 '>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
