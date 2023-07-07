import { useQuery } from '@tanstack/react-query'
import React from 'react'
import totalAll from '../../apis/total.api'
import { useEffect } from 'react'
import { useState } from 'react'
import { formatNumber } from '../../pages/Utils/utils'

export default function SlideShow() {
  const [listTotal, setlistTotal] = useState([])
  const { data: gettotalAll, refetch } = useQuery({
    queryKey: ['gettotalAll'],
    queryFn: totalAll.gettotalAll
  })

  useEffect(() => {
    if (gettotalAll && gettotalAll.data) {
      setlistTotal(gettotalAll)
    }
  }, [gettotalAll])
  console.log(listTotal)
  return (
    <div className='bg-white'>
      {listTotal && (
        <div className='container'>
          <p className='flex justify-start pt-2 ml-2 font-thin text-gray-500'>Doanh Thu Và Đơn Bán Từ Thứ 2:</p>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-3 '>
              <div className='m-4 bg-blue-400'>
                <div className='h-40 w-full flex flex-col items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>

                  <span className='text-white py-2'>Tổng doanh thu</span>
                  <p className='font-bold'>đ{formatNumber(listTotal.data?.totalRevenue)}</p>
                </div>
              </div>
            </div>
            <div className='col-span-3 '>
              <div className='m-4 bg-blue-400'>
                <div className='h-40 w-full flex flex-col items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
                    />
                  </svg>

                  <span className='text-white py-2'>Tổng Đơn Bán</span>
                  <p className='font-bold'>{listTotal.data?.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className='col-span-3 '>
              <div className='m-4 bg-blue-400'>
                <div className='h-40 w-full flex flex-col items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
                    />
                  </svg>

                  <span className='text-white py-2'>Tổng Khách Hàng</span>
                  <p className='font-bold'>{listTotal.data?.totalUser}</p>
                </div>
              </div>
            </div>
            <div className='col-span-3 '>
              <div className='m-4 bg-blue-400'>
                <div className='h-40 w-full flex flex-col items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
                    />
                  </svg>

                  <span className='text-white py-2'>Số lượng bình luận</span>
                  <p className='font-bold'>{listTotal.data?.totalReview}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
