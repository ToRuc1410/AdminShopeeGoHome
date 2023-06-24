import React, { useState } from 'react'
import Header from '../../components/Header/header'

import { NavLink, Outlet } from 'react-router-dom'
import classNames from 'classnames'

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
            <div className='ml-8 mt-3 text-left'>
              <NavLink
                to='/system/orders'
                className={({ isActive }) =>
                  classNames(
                    ' text-gray-600 px-3 hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm lg:text-sm',
                    { 'text-blue-500 bg-blue-100': isActive }
                  )
                }
              >
                Quản Lý Đơn Hàng
              </NavLink>
            </div>
            <button className='cursor-pointer my-5 lg:text-sm ' onClick={handleCheck}>
              <div className='flex text-gray-600 px-3'>
                <span>Quản Lý Sản Phẩm</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4 ml-2'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                </svg>
              </div>
              <div className={isActive ? '' : 'hidden'}>
                <li className='ml-4 mt-4 text-left'>
                  <NavLink
                    to='/system/categories'
                    className={({ isActive }) =>
                      classNames(
                        ' text-gray-600 px-3 hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm',
                        { 'text-blue-500 bg-blue-100': isActive }
                      )
                    }
                  >
                    Quản Lý Danh Mục
                  </NavLink>
                </li>
                <li className='ml-4 mt-4 text-left'>
                  <NavLink
                    to='/system/products'
                    className={({ isActive }) =>
                      classNames(
                        ' text-gray-600 px-3 hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm',
                        { 'text-blue-500 bg-blue-100': isActive }
                      )
                    }
                  >
                    Quản Lý Sản Phẩm
                  </NavLink>
                </li>
              </div>
            </button>
            <div className=' ml-8 mt-1 my-5 text-left'>
              <NavLink
                to='/system/users'
                className={({ isActive }) =>
                  classNames(
                    ' text-gray-600 px-3 hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm',
                    { 'text-blue-500 bg-blue-100': isActive }
                  )
                }
              >
                Quản Lý Người Dùng
              </NavLink>
            </div>
            <div className='ml-8 text-left mt-4'>
              <NavLink
                to='/system/employees'
                className={({ isActive }) =>
                  classNames(
                    ' text-gray-600 px-3 hover:bg-blue-200 hover:text-blue-500 py-2 transition-colors rounded-sm text-sm',
                    { 'text-blue-500 bg-blue-100': isActive }
                  )
                }
              >
                Quản Lý Nhân Viên
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
