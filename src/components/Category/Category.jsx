import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Button, Form, Modal } from 'antd'
import InputComponent from '../InputComponent/InputComponent'
import CategoryAPI from '../../apis/category.api'

export default function Category() {
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [form] = Form.useForm()
  const [name, setName] = useState('')
  const [nameUpdate, setNameUpdate] = useState('')

  const [idCategory, setIdCategory] = useState('')

  const { data: CategoryData, refetch } = useQuery({
    queryKey: ['getCategories'],
    queryFn: CategoryAPI.getAllCategories
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: CategoryAPI.deleteCategory,
    onSuccess: () => {
      refetch()
    }
  })
  const createCategoryMutation = useMutation({
    mutationFn: CategoryAPI.createCategory,
    onSuccess: () => {
      refetch()
    }
  })
  const updateCategoryMutation = useMutation({
    mutationFn: CategoryAPI.updateCategory,
    onSuccess: () => {
      refetch()
    }
  })
  const handleDeleteCategories = async (id) => {
    const confirmation = window.confirm('Bạn có chắc Xoá danh Mục và Sản Phẩm trong Danh Mục đó không?')
    if (confirmation) {
      const resDeleteCategory = await deleteCategoryMutation.mutateAsync(id)
      if (resDeleteCategory) {
        toast.success(resDeleteCategory?.data.message, {
          position: 'top-center',
          autoClose: 1000
        })
      }
    }
  }
  const handleCreate = async () => {
    const resCreateCategoryMutation = await createCategoryMutation.mutateAsync({ name: name })
    console.log(resCreateCategoryMutation)
    toast.success(resCreateCategoryMutation?.data.message, {
      position: 'top-center',
      autoClose: 1000
    })
    setName('')
    setOpenCreate(false)
  }
  const resCategoryData = CategoryData?.data.data
  const showModal = () => {
    setOpenCreate(!openCreate)
  }
  const showModalForUpdate = (id, nameCategory) => () => {
    form.setFieldsValue({
      nameCategory: nameCategory
    })
    setIdCategory(id)
    // setNameUpdate(nameCategory)
    // setIdCategory(idCategory)
    setOpenUpdate(!openUpdate)
  }
  const handleCancel = () => {
    setOpenCreate(false)
    setOpenUpdate(false)
    setName('')
  }
  const handleInputChange = (e) => {
    setName(e.target.value)
  }
  const handleInputUpdateChange = (e) => {
    setNameUpdate(e.target.value)
  }
  // updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
  const handleUpdate = async () => {
    const resupdateCategoryMutation = await updateCategoryMutation.mutateAsync({ id: idCategory, name: nameUpdate })
    toast.success(resupdateCategoryMutation?.data.message, {
      position: 'top-center',
      autoClose: 1000
    })
    setOpenUpdate(!openUpdate)
  }
  return (
    <div className='px-2'>
      {resCategoryData && resCategoryData.length > 0 ? (
        <div>
          <div className='flex justify-between'>
            <div className='mt-3'>
              <h2 className='text-left pt-4 font-sans text-gray-600'>Quản Lý Danh Mục</h2>
              <div className='h-[2px] w-10px bg-white'></div>
            </div>
            <>
              <Button type='default' onClick={showModal} className='bg-blue-300 h-10'>
                Tạo Danh Mục
              </Button>
              <Modal title='Tạo Danh Mục' open={openCreate} footer={null} onCancel={handleCancel}>
                <Form onFinish={handleCreate}>
                  <Form.Item
                    name='name'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập Tên Danh Mục là bắt buộc'
                      }
                    ]}
                  >
                    <InputComponent
                      placeholder='Nhập Tên Danh Mục'
                      name='nameCategory'
                      onChange={handleInputChange}
                      value={name}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button className='bg-blue-400 float-right' type='primary' htmlType='submit'>
                      Lưu
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </>
          </div>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg m-2'>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    STT
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Tên Danh Mục
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {resCategoryData &&
                  resCategoryData.map((item, index) => (
                    <tr
                      className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      key={item._id}
                    >
                      <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        {index + 1}
                      </th>
                      <td className='px-6 py-4 capitalize'>{item.name}</td>

                      <td className='flex px-3 py-4'>
                        <button
                          className='font-medium text-blue-600 dark:text-blue-500 mr-3 hover:underline'
                          onClick={() => handleDeleteCategories(item._id)}
                        >
                          Xóa
                        </button>

                        <Button
                          type='default'
                          onClick={showModalForUpdate(item._id, item.name)}
                          className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                        >
                          Chỉnh Sửa
                        </Button>

                        <Modal title='Cập Nhật Danh Mục' open={openUpdate} footer={null} onCancel={handleCancel}>
                          <Form onFinish={handleUpdate} form={form} initialValues={item}>
                            <Form.Item
                              name='nameCategory'
                              rules={[
                                {
                                  required: true,
                                  message: 'Nhập Tên Danh Mục là bắt buộc'
                                }
                              ]}
                            >
                              <InputComponent
                                placeholder='Cập Nhật Tên Danh Mục'
                                name='nameCategory'
                                onChange={handleInputUpdateChange}
                                value={nameUpdate}
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button className='bg-blue-400 float-right' type='primary' htmlType='submit'>
                                Lưu
                              </Button>
                            </Form.Item>
                          </Form>
                        </Modal>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className=''>Danh sách rỗng...</div>
      )}
    </div>
  )
}
