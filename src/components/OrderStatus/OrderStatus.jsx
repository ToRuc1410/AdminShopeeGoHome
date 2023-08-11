import React, { useEffect, useState } from 'react'
import OrderDetailAPI from '../../apis/orderDetail.api'
import { Popover } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  renderBgColorStatusCode,
  renderColorStatusCode,
  renderDate,
  renderStatusCode
} from '../../pages/Utils/renderStatusCode'
import { formatNumber } from '../../pages/Utils/utils'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { produce } from 'immer'
import { toast } from 'react-toastify'
import { orderStatus, payMent } from '../../constant/OrderStatus'
import useQueryConfig from '../../hook/useQueryConfig'
import * as XLSX from 'xlsx'

import socket from '../../constant/socket'

import io from 'socket.io-client'

const socket = io('http://localhost:4000/')

export default function OrderStatus() {
  // getAllOrder Detail
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const [dataListOrder, setDataListOrder] = useState([])
  const [isShowStatus, setIsShowStatus] = useState(false)
  const [isShowPayment, setIsShowPayment] = useState(false)
  const [name, setName] = useState('')

  const { data: getAllDetailData, refetch } = useQuery({
    queryKey: ['getAllDetail', queryConfig],
    queryFn: () => {
      return OrderDetailAPI.getAllDetail(queryConfig)
    }
  })
  const deleteOrdersMutation = useMutation({
    mutationFn: OrderDetailAPI.deleteOrders,
    onSuccess: () => {
      refetch()
    }
  })

  const resgetAllDetailData = getAllDetailData?.data.data

  useEffect(() => {
    resgetAllDetailData &&
      setDataListOrder(
        resgetAllDetailData.map((item) => {
          return {
            ...item,
            checked: false
          }
        })
      )
  }, [resgetAllDetailData])
  useEffect(() => {
    socket.on('boughtOrder', () => {
      refetch()
    })
    socket.on('removedOrderToServer', () => {
      refetch()
    })
    return () => {
      socket.off('boughtOrder')
      socket.off('removedOrderToServer')
    }
  }, [])
  const hanldeOpenDetail = (id) => {
    navigate('/system/detailOrderStatus', {
      state: {
        detailStatus: id
      }
    })
  }

  // cơ chế currying
  const handleCheck = (index) => (event) => {
    setDataListOrder(
      produce((draft) => {
        draft[index].checked = event.target.checked
      })
    )
  }
  const checkedData = dataListOrder.filter((item) => item.checked)

  // delete many items
  const handleDeleteChecked = async () => {
    const confirmation = window.confirm('Bạn có chắc xóa Đơn hàng không?')
    if (confirmation) {
      const dataManyChecked = checkedData.map((item) => item._id)
      await deleteOrdersMutation.mutateAsync(dataManyChecked, {
        onSuccess: (data) => toast.success(data.data.message)
      })
    }
  }

  // export data files
  const handleExportExcel = () => {
    console.log(dataListOrder)
    if (dataListOrder.length > 0) {
      // Xóa các trường không cần thiết (ví dụ: email)
      const filteredData = dataListOrder.map(
        ({ _id, user, detailPurchase, createdAt, updatedAt, __v, checked, ...rest }) => rest
      )
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(filteredData)
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đơn hàng')
      XLSX.writeFile(wb, 'DanhSachDonHang.xlsx')
    }
  }

  const handleGetStatus = (key) => {
    navigate({
      pathname: '/system/orders',
      search: createSearchParams({
        status: key
      }).toString()
    })
    setIsShowStatus(false)
  }
  const handleGetStatusPayment = (key) => {
    navigate({
      pathname: '/system/orders',
      search: createSearchParams({
        payMent: key
      }).toString()
    })
    setIsShowPayment(false)
  }
  const handleSearch = (event) => {
    navigate({
      pathname: '/system/orders',
      search: createSearchParams({
        code: name
      }).toString()
    })
    event.preventDefault()
  }
  const hanldeSearchCode = (e) => {
    setName(e.target.value.trim())
  }
  return (
    <div className='px-2'>
      {dataListOrder && dataListOrder.length > 0 ? (
        <div>
          <div className='flex justify-between'>
            <div className='mt-3'>
              <h2 className='text-left pt-4 font-sans text-gray-600'>Quản Lý Đơn Hàng</h2>
              <div className='h-[2px] w-10px bg-white'></div>
            </div>
            <div className='flex'>
              <button className='mr-3 flex text-xs bg-slate-400 rounded-lg py-4 px-2 my-2' onClick={handleExportExcel}>
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
                    d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'
                  />
                </svg>

                <span>Xuất file Excel</span>
              </button>
              <button className='flex text-xs bg-red-500 rounded-lg py-4 px-2 my-2' onClick={handleDeleteChecked}>
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
          </div>

          <div className='py-4'>
            <div className='relative overflow-x-auto h-96 overflow-y-auto shadow-md sm:rounded-lg'>
              <div className='flex items-center justify-around py-4 bg-white dark:bg-gray-800 border-b border-slate-500'>
                <span className='flex'>
                  <p> Tổng Số Đơn Hàng: </p> <p className='text-red-500'> {dataListOrder && dataListOrder.length}</p>
                </span>

                <div className='relative mr-5'>
                  <form onSubmit={handleSearch}>
                    <div className='flex'>
                      <input
                        type='text'
                        value={name}
                        id='table-search-users'
                        className='outline-none block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-tl-lg rounded-bl-lg  w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder='Lọc Đơn Hàng'
                        name='code'
                        onChange={hanldeSearchCode}
                      />
                      <button className='bg-blue-500 py-2 px-5 rounded-tr-lg rounded-br-lg' type='submit'>
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
                            d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 p-5'>
                <thead className='text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
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
                      <div className='flex items-center'>
                        <span>Trạng Thái: </span>
                        <Popover
                          content={
                            <ol className='capitalize'>
                              {Object.entries(orderStatus).map(([key, value]) => (
                                <li
                                  className='hover:bg-slate-400 hover:text-white cursor-pointer px-3 py-2'
                                  key={key}
                                  value={key}
                                  onClick={() => handleGetStatus(key)}
                                  name='status'
                                >
                                  {value}
                                </li>
                              ))}
                            </ol>
                          }
                          title='Chọn Trạng Thái'
                          trigger='click'
                          open={isShowStatus}
                          onOpenChange={() => setIsShowStatus(!isShowStatus)}
                        >
                          <button className='text-blue-500 bg-slate-100 py-1 px-3 rounded-sm '>
                            <svg
                              className='fill-current h-4 w-4'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 20 20'
                            >
                              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                            </svg>
                          </button>
                        </Popover>
                      </div>
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      <span>Thanh Toán</span>
                      <Popover
                        content={
                          <ol className='capitalize'>
                            {Object.entries(payMent).map(([key, value]) => (
                              <li
                                className='hover:bg-slate-400 hover:text-white cursor-pointer px-3 py-2'
                                key={key}
                                value={key}
                                onClick={() => handleGetStatusPayment(key)}
                                name='payment'
                              >
                                {value}
                              </li>
                            ))}
                          </ol>
                        }
                        title='Chọn Thanh Toán'
                        trigger='click'
                        open={isShowPayment}
                        onOpenChange={() => setIsShowPayment(!isShowPayment)}
                      >
                        <button className='text-blue-500 bg-slate-100 py-1 px-3 rounded-sm '>
                          <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                            <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                          </svg>
                        </button>
                      </Popover>
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
                  {dataListOrder &&
                    dataListOrder.map((item, index) => (
                      <tr
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:cursor-pointer'
                        key={item._id}
                      >
                        <td className='w-4 p-4'>
                          <div className='flex items-center'>
                            <input
                              id='checkbox-table-search-1'
                              type='checkbox'
                              checked={item.checked}
                              onChange={handleCheck(index)}
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
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${renderBgColorStatusCode(item.status)} mr-2`}
                              />
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
                        <td className='px-6 py-4'>{` ₫${formatNumber(item.total_price)}`}</td>
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
            </div>
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center'>Đơn hàng rỗng</div>
      )}
    </div>
  )
}
