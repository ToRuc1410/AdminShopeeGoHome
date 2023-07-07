import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import OrderDetailAPI from '../../apis/orderDetail.api'
import { useState } from 'react'
import { useEffect } from 'react'
import { renderHoursAndDate } from '../../pages/Utils/renderStatusCode'
import { produce } from 'immer'
import { toast } from 'react-toastify'

export default function ReviewOrder() {
  const { data: getAllReviewOrder, refetch } = useQuery({
    queryKey: ['getAllReviewOrder'],
    queryFn: OrderDetailAPI.getAllReviewOrder
  })

  const deleteReviewOrdersMutation = useMutation({
    mutationFn: OrderDetailAPI.deleteReviewOrder,
    onSuccess: () => {
      refetch()
    }
  })

  console.log(getAllReviewOrder)
  // render data xóa hoặc lấy ds
  const [dataListReviewOrder, setDataListReviewOrder] = useState([])
  // dùng để render data for search
  const [searchResults, setSearchResults] = useState([])

  const [name, setName] = useState('')

  const resGetAllReviewOrder = getAllReviewOrder?.data.data
  useEffect(() => {
    resGetAllReviewOrder &&
      setDataListReviewOrder(
        resGetAllReviewOrder.map((item) => {
          return {
            ...item,
            checked: false
          }
        })
      )
  }, [resGetAllReviewOrder])

  useEffect(() => {
    resGetAllReviewOrder && setSearchResults(resGetAllReviewOrder)
  }, [resGetAllReviewOrder])

  // cơ chế currying
  const handleCheck = (index) => (event) => {
    setDataListReviewOrder(
      produce((draft) => {
        draft[index].checked = event.target.checked
      })
    )
  }
  const checkedData = dataListReviewOrder.filter((item) => item.checked)

  // delete many items
  const handleDeleteChecked = async () => {
    if (checkedData.length > 0) {
      const confirmation = window.confirm('Bạn có chắc xóa không?')
      if (confirmation) {
        const dataManyChecked = checkedData.map((item) => item._id)

        await deleteReviewOrdersMutation.mutateAsync(dataManyChecked, {
          onSuccess: (data) => toast.success(data.data.message)
        })
      }
    }
  }

  const hanldeSearchCode = (e) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = dataListReviewOrder.filter((review) => {
        return review.order.nameUser.toLowerCase().startsWith(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setSearchResults(results)
    } else {
      setSearchResults(dataListReviewOrder)
      // If the text field is empty, show all users
    }

    setName(keyword)
  }
  return (
    <div className='px-2'>
      {searchResults && (
        <>
          <div className='flex justify-between'>
            <div className='mt-3'>
              <h2 className='text-left pt-4 font-sans text-gray-600'>Quản Lý Đánh Giá Sản Phẩm</h2>
              <div className='h-[2px] w-10px bg-white'></div>
            </div>
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
          <div className='py-4'>
            <div className='relative overflow-x-auto h-96  overflow-y-auto shadow-md sm:rounded-lg'>
              <div className='flex items-center justify-around py-4 bg-white dark:bg-gray-800 border-b border-slate-500'>
                <span className='flex'>
                  <p className='mr-2'>Đánh giá sản phẩm: </p>
                  <p className='text-red-500 font-semibold'> {searchResults && searchResults.length} </p>
                </span>

                <div className='relative mr-5'>
                  <div className='flex'>
                    <input
                      type='search'
                      id='table-search-users'
                      className='outline-none block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='Tìm Kiếm Theo Tên Khách Hàng'
                      value={name}
                      onChange={hanldeSearchCode}
                    />
                  </div>
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
                      Tên Khách Hàng
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Xếp Hạng
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Đánh Giá
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Mã Đơn Hàng
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Sản Phẩm Của Đơn Hàng
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Ảnh Đơn Hàng
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Ngày Đánh Giá
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults && searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                      <tr
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:cursor-pointer'
                        key={index}
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

                        <td className='px-6 py-4'>{item.order?.nameUser}</td>
                        <td className='px-6 py-8 flex'>
                          <span>{item.rating}</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-5 h-5 text-yellow-500'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
                            />
                          </svg>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='font-semibold'>Chất liệu: </span>
                          <span>{item.material ? item.material : '_'}</span>
                          <br />
                          <span className='font-semibold'>Mô Tả: </span>
                          <span>{item.description ? item.description : '_'}</span>
                          <br />
                          <span className='font-semibold'>Chi Tiết: </span>
                          <span>{item.message ? item.message : '_'}</span>
                        </td>
                        <td className='px-6 py-4 font-semibold'>{item.order?.orderCode}</td>
                        <td className='px-6 py-4'>
                          {item.order?.detailPurchase.map((product, index) => (
                            <p key={index}>{product.product.name}</p>
                          ))}
                        </td>
                        {/* <td className='px-6 py-4'>{` ₫${formatNumber(item.totalValue)}`}</td> */}
                        <td className='flex flex-wrap'>
                          {item.order?.detailPurchase.map((product, index) => (
                            <img
                              key={index}
                              src={product.product.image}
                              alt={product.product.name}
                              className='h-10 w-10'
                            />
                          ))}
                        </td>
                        <td className='px-6 py-4'>{renderHoursAndDate(item.commentAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>Không Có</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
