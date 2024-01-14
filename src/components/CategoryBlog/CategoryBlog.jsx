import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Button, Form, Modal } from 'antd'
import InputComponent from '../InputComponent/InputComponent'
import CategoryBlogAPI from '../../apis/categoryBlog.api'
import { generateURLNameAndId } from '../../pages/Utils/utils'

export default function CategoryBlog() {
  const [open, setOpen] = useState(false)
  const [update, setUpdate] = useState(false)
  const [nameBlog, setNameBlog] = useState('')
  const [idBlog, setIdBlog] = useState('')
  const [form] = Form.useForm()

  const { data: CategoryDataBlog, refetch } = useQuery({
    queryKey: ['getCategoriesBlog'],
    queryFn: CategoryBlogAPI.getAllCategoriesBlog
  })
  const resCategoryDataBlog = CategoryDataBlog?.data.data

  const deleteCategoryBlogMutation = useMutation({
    mutationFn: CategoryBlogAPI.deleteCategoryBlog,
    onSuccess: () => {
      refetch()
    }
  })

  const createCategoryBlogMutation = useMutation({
    mutationFn: CategoryBlogAPI.createCategoryBlog,
    onSuccess: () => {
      refetch()
    }
  })
  const updateCategoryBlogMutation = useMutation({
    mutationFn: CategoryBlogAPI.updateCategoryBlog,
    onSuccess: () => {
      refetch()
    }
  })

  const handleCreateAndUpdateBlog = async () => {
    if (update) {
      const resUpdateCategoryBlogMutation = await updateCategoryBlogMutation.mutateAsync({ idBlog, nameBlog })
      toast.success(resUpdateCategoryBlogMutation?.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    } else {
      const formData = new FormData()
      formData.append('nameBlog', nameBlog)
      const resCreateCategoryBlogMutation = await createCategoryBlogMutation.mutateAsync(formData)
      toast.success(resCreateCategoryBlogMutation?.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
    form.resetFields()
    setNameBlog('')
    setOpen(false)
  }

  const handleDeleteBlogCategories = async (id = '') => {
    const confirmation = window.confirm('Bạn có chắc Xoá Danh Mục và những tin tức trong Danh Mục này không?')
    if (confirmation && id !== '') {
      const resDeleteCategory = await deleteCategoryBlogMutation.mutateAsync(id)
      toast.success(resDeleteCategory?.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  }

  const showModal = (update = false, title = '', id = '') => {
    setOpen(!open)
    setUpdate(update)
    if (title !== '' && id !== '') {
      form.setFieldsValue({
        nameBlog: title
      })
      setNameBlog(title)
      setIdBlog(id)
    } else {
      form.setFieldsValue({
        nameBlog: ''
      })
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setUpdate(false)
    setNameBlog('')
  }
  const handleInputChange = (e) => {
    setNameBlog(e.target.value)
  }

  return (
    <div className='px-2'>
      <div>
        <div className='flex justify-between'>
          <div className='mt-3'>
            <h2 className='text-left pt-4 font-sans text-gray-600'>Quản Lý Tin Tức</h2>
            <div className='h-[2px] w-10px bg-white'></div>
          </div>
          <>
            <Button type='default' onClick={() => showModal()} className='bg-blue-300 h-10'>
              Tạo Mới Loại Tin Tức
            </Button>
            <Modal title='Loại tin tức mới' open={open} footer={null} onCancel={handleCancel}>
              <Form onFinish={handleCreateAndUpdateBlog} form={form} initialValues={nameBlog}>
                <Form.Item
                  name='nameBlog'
                  label='Nhập loại tin tức'
                  rules={[
                    {
                      required: true,
                      message: 'Nhập loại tin tức là bắt buộc'
                    }
                  ]}
                >
                  <InputComponent
                    placeholder='Nhập loai tin tức mới'
                    name='nameBlog'
                    onChange={handleInputChange}
                    value={nameBlog}
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
        {resCategoryDataBlog && resCategoryDataBlog.length > 0 ? (
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg m-2'>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    STT
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Tiêu đề
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {resCategoryDataBlog.map((item, index) => (
                  <tr
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    key={item._id}
                  >
                    <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      {index + 1}
                    </th>

                    <td className='px-6 py-4 capitalize hover:text-blue-500'>
                      <Link to={`/system/categoryBlog/${generateURLNameAndId(item.title, item._id)}`}>
                        {item.title}
                      </Link>
                    </td>

                    <td className='flex px-3 py-4'>
                      <button
                        className='font-medium text-blue-600 dark:text-blue-500 mr-3 pt-1 hover:underline'
                        onClick={() => handleDeleteBlogCategories(item._id)}
                      >
                        Xóa
                      </button>

                      <Button
                        type='default'
                        onClick={() => showModal(true, item.title, item._id)}
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                      >
                        Chỉnh Sửa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className=''>Danh sách rỗng...</div>
        )}
      </div>
    </div>
  )
}
