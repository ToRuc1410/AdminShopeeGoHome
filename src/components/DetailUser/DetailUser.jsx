import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Form, Modal } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { renderColorStatusCode, renderHoursAndDate, renderStatusCode } from '../../pages/Utils/renderStatusCode'
import { formatNumber, hanldeTime } from '../../pages/Utils/utils'
import { useState } from 'react'
import UserAPI from '../../apis/user.api'
import InputComponent from '../InputComponent/InputComponent'
import { toast } from 'react-toastify'

export default function DetailUser() {
  const location = useLocation()
  const initStates = () => ({
    name: '',
    phone: '',
    address: '',
    updatePass: '',
    email: ''
  })

  const [detailData, setDetailData] = useState([])
  const [openCreate, setOpenCreate] = useState(false)
  const [stateUser, setStateUser] = useState(initStates())
  const idDetailStatus = location.state.detailUser

  const { data: getDetailData, refetch } = useQuery({
    queryKey: ['getDetailOrder'],
    queryFn: () => UserAPI.getDetailUser(idDetailStatus)
  })

  const updateInformationUserMutation = useMutation({
    mutationFn: UserAPI.updateInformationUser,
    onSuccess: (data) => {
      toast.success(data.data.message)
      refetch()
    }
  })

  useEffect(() => {
    if (getDetailData && getDetailData.data) {
      const detailData = getDetailData.data.data
      setDetailData(detailData)
      setStateUser({
        name: detailData.name,
        phone: detailData.phone,
        address: detailData.address,
        email: detailData.email
      })
    }
  }, [getDetailData])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setStateUser({ ...stateUser, [name]: value })
  }
  const [form] = Form.useForm()
  const validatePhoneNumber = (_, value) => {
    const phoneRegex = /^\d{10}$/
    if (value && !phoneRegex.test(value)) {
      return Promise.reject('Số điện thoại là 10 chữ số.')
    }
    return Promise.resolve()
  }

  // Khi bấm vào nút để mở Modal
  const handleOpenModal = () => {
    form.setFieldsValue(stateUser)
    setOpenCreate(!openCreate)
  }

  const handleOnFinish = async () => {
    await updateInformationUserMutation.mutateAsync({
      ...stateUser,
      idUser: idDetailStatus
    })
    setStateUser({ ...stateUser, updatePass: '' })
    setOpenCreate(false)
  }
  return (
    <div className='pb-2'>
      <div className='flex justify-between bg-white py-3 px-5'>
        <div className='py-2'>Thông Tin Khách Hàng</div>

        <button
          className='py-2 flex bg-blue-500 px-3 justify-between text-gray-100 rounded-md'
          onClick={handleOpenModal}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4 mr-1'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'
            />
          </svg>
          <p className='font-thin text-[14px]'>cập nhật thông tin</p>
        </button>

        <Modal
          title='Cập Nhật Thông Tin Khách Hàng'
          open={openCreate}
          footer={null}
          onCancel={() => setOpenCreate(false)}
        >
          <Form onFinish={handleOnFinish} form={form} initialValues={stateUser}>
            <Form.Item label='Email' name='email' className='flex justify-center bg-gray-200'>
              <span>{stateUser.email}</span>
            </Form.Item>
            <Form.Item
              label='Tên Khách Hàng'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Nhập Tên là bắt buộc'
                }
              ]}
            >
              <InputComponent placeholder='Nhập Tên' name='name' onChange={handleInputChange} value={stateUser.name} />
            </Form.Item>
            <Form.Item
              label='Số Điện Thoại'
              name='phone'
              rules={[
                {
                  validator: validatePhoneNumber
                },
                {
                  required: true,
                  message: 'Nhập SDT là bắt buộc'
                }
              ]}
            >
              <InputComponent
                placeholder='Nhập SDT'
                name='phone'
                onChange={handleInputChange}
                value={stateUser.phone}
              />
            </Form.Item>

            <Form.Item
              label='Địa chỉ'
              name='address'
              className='flex-wrap'
              rules={[
                {
                  required: true,
                  message: 'Nhập Địa Chỉ là bắt buộc'
                }
              ]}
            >
              <InputComponent
                placeholder='Nhập Địa Chỉ'
                name='address'
                onChange={handleInputChange}
                value={stateUser.address}
              />
            </Form.Item>

            <Form.Item
              label='Cập Nhật lại Mật Khẩu'
              name='updatePass'
              rules={[
                {
                  min: 6,
                  max: 160,
                  message: 'Tên phải từ 6 đến 160 kí tự'
                }
              ]}
            >
              <InputComponent
                placeholder='Cập Nhật PassWord'
                name='updatePass'
                onChange={handleInputChange}
                value={stateUser.updatePass}
              />
            </Form.Item>
            <Form.Item>
              <Button className='bg-blue-400 float-right' type='primary' htmlType='submit'>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <div className='container'>
        <div className='grid grid-cols-12 gap-6 mt-2 px-5'>
          <div className='col-span-9 rounded-sm  px-4'>
            <div className=' bg-white px-2 py-3'>
              <div className='flex border-b border-gray-500 py-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5 text-blue-500'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                  />
                </svg>

                <span className='text-sm '>{detailData.name ? detailData.name : detailData.email}</span>
              </div>

              <div className='relative overflow-x-auto mt-2'>
                {/* <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400 py-2'>
                  <tr>
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
                <tbody></tbody>
              </table> */}
                <div className='flex  justify-around px-5'>
                  <div className='flex flex-col'>
                    <span className='text-blue-500 text-sm'>Đơn Hàng Gần Nhất</span>
                    <span className='font-sans py-1 text-sm'>{hanldeTime(detailData.timeDiff)}</span>
                  </div>

                  <div className='flex flex-col'>
                    <span>Danh Thu Tích Lũy</span>
                    <span className='py-2 text-sm'>đ{formatNumber(detailData.totalValue)}</span>
                    <span className='text-gray-500 text-xs'>{`${detailData.totalOrders} đơn hàng`}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white mt-3 px-5 py-2 relative overflow-y-auto overflow-x-auto shadow-md sm:rounded-lg'>
              <div className='flex border-b border-gray-500 py-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5 text-blue-500'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
                  />
                </svg>

                <span className='text-sm font-semibold '>Đơn Hàng</span>
              </div>
              {detailData.listOrders?.map((item) => (
                <div className='border-b border-gray-500 py-2' key={item._id}>
                  <div className='flex justify-between py-1'>
                    <div className='flex'>
                      <p> Mã Đơn Hàng: </p> <p className='font-semibold'>{item.orderCode}</p>
                    </div>
                    <span>{renderHoursAndDate(item.orderDate)}</span>
                  </div>
                  <div className='flex justify-between py-1'>
                    <span>{`Thanh Toán: đ${formatNumber(item.total_price)}`}</span>
                    <span className={`capitalize ${renderColorStatusCode(item.status)}`}>{`${renderStatusCode(
                      item.status
                    )}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='col-span-3 '>
            <div className='flex flex-col'>
              <div className='rounded-sm py-2 bg-white px-4'>
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
                  <span className='float-left text-sm ml-2'>Thông Tin Liên Hệ</span>
                </div>
                <div className='flex justify-between px-3'>
                  <div className='flex flex-col text-left text-sm'>
                    <span>Email: </span>
                    <span className='py-2'>Tên: </span>
                    <span>SDT:</span>
                  </div>
                  <div className='flex flex-col font-bold text-sm text-right'>
                    <span>{detailData.email}</span>
                    <span className='py-2'>{detailData.name ? detailData.name : '_'}</span>
                    <span>{detailData.phone}</span>
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
                      d='M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9'
                    />
                  </svg>

                  <span className='float-left text-sm ml-2 font-semibold'>Địa chỉ mặc định</span>
                </div>
                <div className='py-2 px-3 text-sm'>
                  <span>{detailData.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
