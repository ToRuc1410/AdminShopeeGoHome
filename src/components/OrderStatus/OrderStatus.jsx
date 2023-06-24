import React from 'react'
import OrderDetailAPI from '../../apis/orderDetail.api'
import { useQuery } from '@tanstack/react-query'
import {
  renderBgColorStatusCode,
  renderColorStatusCode,
  renderDate,
  renderStatusCode
} from '../../pages/Utils/renderStatusCode'
import { calculatePrice, formatNumber } from '../../pages/Utils/utils'
import { useNavigate } from 'react-router-dom'

export default function OrderStatus() {
  // getAllOrder Detail
  const { data: getAllDetailData, refetch } = useQuery({
    queryKey: ['getAllDetail'],
    queryFn: OrderDetailAPI.getAllDetail
  })

  const resgetAllDetailData = getAllDetailData?.data.data
  console.log(resgetAllDetailData)
  const navigate = useNavigate()
  const hanldeOpenDetail = (id) => {
    navigate('/system/detailOrderStatus', {
      state: {
        detailStatus: id
      }
    })
  }

  return (
    <div className='px-2'>
      <div className='flex justify-between'>
        <div className='mt-3'>
          <h2 className='text-left pt-4 font-sans text-gray-600'>Quản Lý Đơn Hàng</h2>
          <div className='h-[2px] w-10px bg-white'></div>
        </div>

        <button className='flex text-xs bg-red-500 rounded-lg py-4 px-2 my-2'>
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
              d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
            />
          </svg>
          <span>Xóa mục chọn</span>
        </button>
      </div>

      <div className='py-4'>
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
          <div className='flex items-center justify-end py-4 bg-white dark:bg-gray-800 border-b border-slate-500'>
            <label htmlFor='table-search' className='sr-only'>
              Search
            </label>
            <div className='relative mr-5'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <svg
                  className='w-5 h-5 text-gray-500 dark:text-gray-400'
                  aria-hidden='true'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <input
                type='text'
                id='table-search-users'
                className='block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Lọc Đơn Hàng'
              />
            </div>
          </div>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 p-5'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='p-4'>
                  <div className='flex items-center'>
                    <input
                      id='checkbox-all-search'
                      type='checkbox'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                    />
                    <label htmlFor='checkbox-all-search' className='sr-only'>
                      checkbox
                    </label>
                  </div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  Mã
                </th>
                <th scope='col' className='px-6 py-3'>
                  Khách Hàng
                </th>
                <th scope='col' className='px-6 py-3'>
                  Trạng Thái
                </th>
                <th scope='col' className='px-6 py-3'>
                  Thanh Toán
                </th>
                <th scope='col' className='px-6 py-3'>
                  Ngày Đặt
                </th>
                <th scope='col' className='px-6 py-3'>
                  Tổng Tiền
                </th>
                <th scope='col' className='px-4 py-3'>
                  Thông Tin
                </th>
              </tr>
            </thead>
            <tbody>
              {resgetAllDetailData &&
                resgetAllDetailData.map((item) => (
                  <tr
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:cursor-pointer'
                    key={item._id}
                  >
                    <td className='w-4 p-4'>
                      <div className='flex items-center'>
                        <input
                          id='checkbox-table-search-1'
                          type='checkbox'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <label htmlFor='checkbox-table-search-1' className='sr-only'>
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope='row'
                      className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'
                    >
                      <div className='pl-3'>
                        <span>{item.orderCode}</span>
                      </div>
                    </th>
                    <td className='px-6 py-4'>{item.nameUser}</td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center'>
                        {item.status !== 4 ? (
                          <div className={`h-2.5 w-2.5 rounded-full ${renderBgColorStatusCode(item.status)} mr-2`} />
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-4 h-4 mr-2 text-green-500'
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                          </svg>
                        )}
                        <span className={`capitalize ${renderColorStatusCode(item.status)}`}>
                          {renderStatusCode(item.status)}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      {item.isPaid ? (
                        <span className='capitalize text-green-500'>Đã Thanh Toán</span>
                      ) : (
                        <span className='capitalize text-blue-500'>Chưa Thanh Toán</span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <span>{renderDate(item.orderDate)}</span>
                    </td>
                    <td className='px-6 py-4'>{` ₫${formatNumber(calculatePrice(item.detailPurchase))}`}</td>
                    <td className=''>
                      <button
                        className='bg-blue-500 py-2 px-3 text-xs text-slate-100 rounded-sm hover:bg-orange-400'
                        onClick={() => hanldeOpenDetail(item._id)}
                      >
                        Xem Chi Tiết
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* <nav className='flex items-center justify-between pt-4' aria-label='Table navigation'>
            <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
              Showing <span className='font-semibold text-gray-900 dark:text-white'>1-10</span>
              <span className='font-semibold text-gray-900 dark:text-white'>1000</span>
            </span>
            <ul className='inline-flex items-center -space-x-px'>
              <li>
                <a
                  href='#'
                  className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  <span className='sr-only'>Previous</span>
                  <svg
                    className='w-5 h-5'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href='#'
                  aria-current='page'
                  className='z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  ...
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  100
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  <span className='sr-only'>Next</span>
                  <svg
                    className='w-5 h-5'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav> */}
        </div>
      </div>
    </div>
  )
}
