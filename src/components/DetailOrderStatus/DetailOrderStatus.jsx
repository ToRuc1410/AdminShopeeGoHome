import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import OrderDetailAPI from '../../apis/orderDetail.api'
import { useMutation, useQuery } from '@tanstack/react-query'

import { renderColorStatusCode, renderHoursAndDate, renderStatusCode } from '../../pages/Utils/renderStatusCode'

import { renderColorStatusCode, renderDate, renderStatusCode } from '../../pages/Utils/renderStatusCode'

import { calculatePrice, formatNumber } from '../../pages/Utils/utils'
import { Button, Modal, Form, Select } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useReactToPrint } from 'react-to-print'
import { Spinner } from '@material-tailwind/react'

import socket from '../../constant/socket'

import io from 'socket.io-client'

const socket = io('http://localhost:4000/')

const reasion = [
  {
    label: 'Khách hàng yêu cầu hủy',
    value: 'Khách hàng yêu cầu hủy'
  },
  {
    label: 'Hết hàng',
    value: 'Hết hàng'
  },
  {
    label: 'Khác ',
    value: 'Khác '
  }
]
const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
export default function DetailOrderStatus() {
  const location = useLocation()
  const componentRef = useRef()

  const idDetailStatus = location.state?.detailStatus
  const [open, setOpen] = useState(false)
  const [openCancel, setOpenCancel] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [form] = Form.useForm()
  // getAllOrder Detail
  const { data: getDetailData, refetch } = useQuery({
    queryKey: ['getDetailOrder'],
    queryFn: () => OrderDetailAPI.getOrderDetail(idDetailStatus)
  })
  const detailData = getDetailData?.data?.data

  const updateMutation = useMutation({
    mutationFn: () => OrderDetailAPI.updateOrders(idDetailStatus),
    onSuccess: () => {
      refetch()
    }
  })
  const updateDeliveryMutation = useMutation({
    mutationFn: () => OrderDetailAPI.updateDelivery(idDetailStatus),
    onSuccess: () => {
      refetch()
    }
  })
  const updateDoneMutation = useMutation({
    mutationFn: () => OrderDetailAPI.updateDone(idDetailStatus),
    onSuccess: () => {
      refetch()
    }
  })
  const cancelOrderMutation = useMutation({
    mutationFn: OrderDetailAPI.cancelOrder,
    onSuccess: () => {
      refetch()
    }
  })

  const showModal = () => {
    setOpen(!open)
  }

  const handleOk = async () => {
    const resUpdateMutation = await updateMutation.mutateAsync()
    if (resUpdateMutation) {
      socket.emit('confirmOrder')
      toast.success(resUpdateMutation.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
    } else {
      toast.error(resUpdateMutation.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }
  const printData = useReactToPrint({
    onBeforeGetContent: () => {
      setHidden(true)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    },
    documentTitle: 'Thông Tin Phiếu Vận Chuyển',
    content: () => componentRef.current,
    onAfterPrint: () => {
      setHidden(false), refetch()
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    }
  })
  const handlePrintData = async () => {
    const shouldPrint = window.confirm('Bạn có muốn chuyển sang trạng thái giao hàng?')
    if (shouldPrint) {
      printData()
      const res = await updateDeliveryMutation.mutateAsync()
      if (res) {
        socket.emit('deliveryOrder')
      }
    }
  }
  const handleCancelOrder = (idOrder) => async (values) => {
    const resCancelOrder = await cancelOrderMutation.mutateAsync({
      messageReasion: values.reasonCancel,
      ...detailData
    })
    if (resCancelOrder) {
      socket.emit('cancelOrder')
      toast.success(resCancelOrder.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
    } else {
      toast.error(resCancelOrder.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
    setOpenCancel(false)
  }

  const handleDone = (idOrder) => async () => {
    console.log(idOrder)
    const resUpdateDoneOrder = await updateDoneMutation.mutateAsync()
    if (resUpdateDoneOrder) {
      socket.emit('doneOrder')
      toast.success(resUpdateDoneOrder.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
    } else {
      toast.error(resUpdateDoneOrder.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  }
  // Tiếp tục xử lý dữ liệu

  useEffect(() => {
    socket.on('DeliveredOrderToAdmin', () => {
      refetch()
    })
    return () => {
      socket.off('DeliveredOrderToAdmin')
    }
  }, [])

  console.log(detailData)

  return (
    <div className='pb-2'>
      {detailData ? (
        <>
          <div className='flex justify-between bg-white py-3 px-5'>
            <div className='py-2'>Quản Lý Đơn Hàng</div>
            {detailData?.status === 3 && (
              <>
                {updateDoneMutation.isLoading ? (
                  <Spinner />
                ) : (
                  <button
                    className='hover:bg-green-500/80 flex bg-green-500 text-white py-2 px-4 rounded-sm mx-2'
                    onClick={handleDone(detailData?._id)}
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
                        d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>

                    <span className='text-sm'>Giao Hàng Thành Công</span>
                  </button>
                )}
              </>
            )}
            <div className='flex'>
              {(detailData?.status === 2 || detailData?.status === 3) && (
                <>
                  {updateDeliveryMutation.isLoading ? (
                    <Spinner />
                  ) : (
                    <button
                      className='hover:bg-blue-500/80 flex bg-blue-500 text-white py-2 px-4 rounded-sm mx-2'
                      onClick={handlePrintData}
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
                          d='M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z'
                        />
                      </svg>

                      <span className='text-sm'>Tạo Phiếu Vận Chuyển</span>
                    </button>
                  )}
                </>
              )}
              {detailData?.status !== 5 && (
                <Button
                  className=' hover:bg-red-500/80  flex bg-red-500 text-white px-4 rounded-sm pb-4 '
                  onClick={() => setOpenCancel(!openCancel)}
                  style={{ color: 'white' }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4 mt-1'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5'
                    />
                  </svg>

                  <span className='text-sm'>Hủy Đơn Hàng</span>
                </Button>
              )}
              <Modal
                title='Xác Nhận Hủy Đơn Hàng'
                open={openCancel}
                onCancel={() => setOpenCancel(false)}
                footer={null}
              >
                <hr />
                <div className=' bg-green-300 py-2 px-3 text-green-900 my-3'>
                  Hủy bỏ 1 đơn hàng thao tác này không thể phục hồi,cân nhắc tránh nhầm đơn hàng.
                </div>
                <Form
                  {...layout}
                  form={form}
                  name='control-hooks'
                  onFinish={handleCancelOrder(detailData?._id)}
                  style={{
                    maxWidth: 600
                  }}
                  className='pb-10'
                >
                  <Form.Item
                    name='reasonCancel'
                    label='Lý Do Hủy Đơn'
                    rules={[
                      {
                        required: true,
                        message: 'Lý Do Hủy Là Bắt Buộc'
                      }
                    ]}
                  >
                    <Select options={reasion} />
                  </Form.Item>
                  <p>Chú ý:</p>
                  <p>
                    Khi đơn hàng bị hủy, số lượng sản phẩm đã xuất kho sẽ được chuyển trả lại bằng đúng số lượng đã xuất
                    cho đơn hàng ở các trạng thái Hoàn thành, Xuất hàng, Chờ xuất hàng trước đó.
                  </p>
                  <div className='float-right py-2'>
                    <Form.Item>
                      <Button type='default' htmlType='submit'>
                        Submit
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </Modal>
            </div>
          </div>
          <div className='container' ref={componentRef}>
            {hidden ? <h2 className='text-center text-xl uppercase py-2 font-bold mt-3'>Phiếu Giao Hàng</h2> : <></>}
            <div className='grid grid-cols-12 gap-4 px-5 mt-2'>
              <div className='col-span-4 rounded-sm py-2 px-4 bg-white'>
                <div className='flex py-2 border-b border-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='text-blue-500 w-4 h-4 '
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                    />
                  </svg>
                  <span className='text-sm ml-1'>Thông Tin Đơn Hàng</span>
                </div>
                <div className='flex justify-between px-3 text-sm'>
                  <div className='flex flex-col text-left'>
                    <span className='pt-2'>Mã</span>
                    <span className='py-2'>Ngày Tạo</span>
                    {hidden ? (
                      <></>
                    ) : (
                      <>
                        <span className='text-[13px]'>Trạng Thái Đơn Hàng</span>
                        {detailData?.status === 5 && (
                          <>
                            <p className='text-[13px]'>Hủy Bởi</p>
                            <p className='text-[13px]'>Lý Do</p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className='flex flex-col font-bold text-right'>
                    <span className='pt-2'>{detailData?.orderCode}</span>

                    <span className='py-2 '>{renderHoursAndDate(detailData?.orderDate)}</span>

                    <span className='py-2 '>{renderDate(detailData?.orderDate)}</span>

                    {hidden ? (
                      <></>
                    ) : (
                      <>
                        <span className={`${renderColorStatusCode(detailData?.status)} capitalize`}>
                          {renderStatusCode(detailData?.status)}
                        </span>
                        {detailData?.status === 5 && (
                          <>
                            <p className={`${renderColorStatusCode(detailData?.status)} capitalize`}>
                              {detailData?.WhoCanceled}
                            </p>
                            <p className={`${renderColorStatusCode(detailData?.status)} capitalize`}>
                              {detailData?.reasonForMessage}
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-span-4 rounded-sm py-2 px-4 bg-white'>
                <div className='flex py-2 border-b border-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='text-blue-500 w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z'
                    />
                  </svg>

                  <span className='text-sm ml-1'>Thanh Toán</span>
                </div>
                <div className='flex flex-col px-3 text-sm'>
                  <span className='text-left py-2'>
                    {detailData?.payment_method == 0 ? 'Thanh Toán Khi Nhận Hàng' : 'Thanh Toán MoMo'}
                  </span>
                  {hidden ? (
                    <></>
                  ) : (
                    <div className='flex justify-between'>
                      <span>Trạng Thái Thanh Toán:</span>
                      <span
                        className={
                          detailData?.isPaid ? 'capitalize text-green-500 font-bold' : 'capitalize text-blue-500'
                        }
                      >
                        {detailData?.isPaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className='col-span-4 rounded-sm py-2 bg-white px-4'>
                <div className='flex py-2 border-b border-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='text-blue-500 w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'
                    />
                  </svg>

                  <span className='text-sm ml-1'>Giao Hàng</span>
                </div>
                <div className='flex justify-between px-3 text-sm'>
                  <div className='flex flex-col text-left'>
                    <span className='py-2'>Hình Thức Lấy Hàng</span>
                    {hidden ? <></> : <span>Trạng Thái Giao Hàng</span>}
                  </div>
                  <div className='flex flex-col font-bold'>
                    <span className='py-2'>Giao Hàng Tận Nơi</span>
                    {hidden ? (
                      <></>
                    ) : (
                      <span
                        className={
                          detailData?.isDelivered ? 'capitalize text-green-500 font-bold' : 'capitalize text-orange-500'
                        }
                      >
                        {detailData?.isDelivered ? 'Đang Giao Hàng' : 'Chưa Giao Hàng'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-span-4'></div>
              <div className='col-span-4'></div>
            </div>
            <div className='grid grid-cols-12 gap-6 mt-2 px-5'>
              <div className='col-span-9 rounded-sm py-2 bg-white px-4'>
                <div className='flex border-b border-gray-500 py-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4 text-blue-500'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                    />
                  </svg>
                  <span className='text-sm'> Chi Tiết Đơn Hàng</span>
                </div>

                <div className='relative overflow-x-auto mt-2'>
                  <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                    <thead className='text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400 py-2'>
                      <tr>
                        {hidden ? (
                          <></>
                        ) : (
                          <th scope='col' className='px-6 py-3 '>
                            Ảnh
                          </th>
                        )}
                        <th scope='col' className='px-6 py-3'>
                          Tên Sản Phẩm
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          Số Lượng
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          Đơn Giá
                        </th>
                        <th scope='col' className='px-6 py-3'>
                          Thành Tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData?.detailPurchase?.map((item) => (
                        <tr className='bg-white border-y dark:bg-gray-800 dark:border-gray-700' key={item._id}>
                          {hidden ? (
                            <></>
                          ) : (
                            <td className='py-2 h-16 w-16'>
                              <img src={item.product.image} alt='img' className='h-16 w-16 object-contain' />
                            </td>
                          )}
                          <td className='px-6 py-4'>{item.product.name}</td>
                          <td className='px-6 py-4'>{item.buy_count}</td>
                          <td className='px-6 py-4'>{` ₫${formatNumber(
                            item.price !== 0 ? item.price : item.price_before_discount
                          )}`}</td>
                          <td className='px-6 py-4 text-right font-sans text-red-500'>
                            {` ₫${formatNumber(
                              (item.price !== 0 ? item.price : item.price_before_discount) * item.buy_count
                            )}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className='flex mt-5 justify-between'>
                    <div className=''></div>

                    <div className='flex justify-between'>
                      <div className='flex flex-col text-left text-sm px-3'>
                        <span>Tổng Tiền Hàng</span>
                        <span className='py-2'>Phí Vận Chuyển</span>
                        <span>Giảm Giá</span>
                        <span className='font-bold py-2'>Tổng giá trị đơn hàng</span>
                      </div>
                      <div className='flex flex-col text-right text-sm px-3'>
                        <span>{` ₫${formatNumber(
                          calculatePrice(detailData.detailPurchase ? detailData.detailPurchase : 0)
                        )}`}</span>

                        <span className='py-2'>{`₫${formatNumber(detailData?.priceDelivery)}`}</span>
                        <span>đ0</span>
                        <span className='text-red-500 font-extrabold py-2'>{`₫${formatNumber(
                          detailData?.total_price
                        )}`}</span>

                        {detailData?.status === 1 && (
                          <Button
                            className='my-6 flex bg-blue-500 px-3 pb-4 text-white rounded-sm'
                            onClick={showModal}
                            style={{ color: 'white' }}
                            disabled={updateMutation.isLoading}
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
                                d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
                              />
                            </svg>
                            {/* <div className='text-sm ml-1'> */}
                            Xác Nhận Đơn Hàng
                          </Button>
                        )}

                        <Modal
                          title='Xác Nhận Đơn Hàng'
                          open={open}
                          okType='default'
                          onOk={handleOk}
                          onCancel={handleCancel}
                        >
                          <p className='py-3'>
                            Bạn có chắc muốn chuyển sang trạng thái <b>Xuất Hàng</b>?
                          </p>
                          <hr />
                        </Modal>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-span-3 '>
                <div className='flex flex-col'>
                  <div className='rounded-sm py-2 bg-white px-4'>
                    <div className='flex text-sm border-b border-b-gray-500 py-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-4 h-4 text-blue-500'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
                        />
                      </svg>

                      <span className='ml-2'>Địa Chỉ Lấy Hàng</span>
                    </div>
                    <span className='italic float-left text-sm mt-2'>Số 30,Đường 50, Tân Tạo, Bình Tân</span>
                  </div>
                  <div className='rounded-sm py-2 bg-white px-4 mt-6'>
                    <div className='flex border-b border-b-gray-500 py-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-4 h-4 text-blue-500'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      <span className='float-left text-sm ml-2'>Thông Tin Người Mua</span>
                    </div>
                    <div className='flex justify-between px-3'>
                      <div className='flex flex-col text-left text-sm'>
                        <span>Tên </span>
                        <span className='py-2'>SDT</span>
                        <span>Ghi Chú: </span>
                      </div>
                      <div className='flex flex-col font-bold text-sm text-right'>
                        <span>{detailData?.nameUser}</span>
                        <span className='py-2'>{`0${detailData?.phone}`}</span>
                        <span>{detailData?.message}</span>
                      </div>
                    </div>
                  </div>
                  <div className='rounded-sm py-2 bg-white px-4 mt-6'>
                    <div className='flex border-b border-b-gray-500 py-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-4 h-4 text-blue-500'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      <span className='float-left text-sm ml-2'>Thông Tin Giao Hàng</span>
                    </div>
                    <div className='flex justify-between px-3 text-sm'>
                      <span className='italic float-left text-sm mt-2'>{detailData?.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className=''>Hiện tại không có đơn hàng nào</div>
      )}
    </div>
  )
}
