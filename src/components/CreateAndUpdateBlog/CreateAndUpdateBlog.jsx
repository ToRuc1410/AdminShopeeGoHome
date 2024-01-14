import React, { useState } from 'react'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css'
import { Button, Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import InputComponent from '../InputComponent/InputComponent'
import { useMutation, useQuery } from '@tanstack/react-query'
import blogsAPI from '../../apis/blogs.api'
import { useNavigate, useParams } from 'react-router-dom'
import { getIdFromURLNameAndId } from '../../pages/Utils/utils'
import { toast } from 'react-toastify'
import Spinner from '../Spinner/Spinner'
import { useEffect } from 'react'

export default function CreateAndUpdateBlog() {
  const mdParser = new MarkdownIt(/* Markdown-it options */)
  const [form] = useForm()
  const { idBlog, codeBlog } = useParams()
  const navigate = useNavigate()
  const initStates = () => ({
    title: '',
    contentHTML: '',
    contentText: '',
    img: null
  })
  const [stateBlog, setstateBlog] = useState(initStates())
  const [selectedImage, setSelectedImage] = useState('')
  const [submit, setSubmit] = useState('create')
  const { data: DataBlog, refetch } = useQuery(['getBlog', codeBlog], () => blogsAPI.getBlog(codeBlog), {
    enabled: !!codeBlog // Tự động kích hoạt query khi codeBlog thay đổi
  })
  useEffect(() => {
    if (DataBlog) {
      const data = DataBlog.data?.data
      setSubmit('update')
      setstateBlog({ ...data })
    }
  }, [DataBlog])
  const createBlogMutation = useMutation(blogsAPI.createBlog)
  const updateBlogMutation = useMutation(blogsAPI.updateBlog)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setstateBlog({ ...stateBlog, [name]: value })
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    // const fileImage = await getBase64(file)
    setSelectedImage(URL.createObjectURL(file))
    setstateBlog({ ...stateBlog, img: file })
  }
  const handleEditorChange = ({ html, text }) => {
    setstateBlog({
      ...stateBlog,
      contentHTML: html,
      contentText: text
    })
  }

  const handleOnFinish = async () => {
    if (submit === 'update') {
      const formData = new FormData()
      formData.append('code', codeBlog)
      formData.append('title', stateBlog.title)
      formData.append('img', stateBlog.img)
      formData.append('contentHTML', stateBlog.contentHTML)
      formData.append('contentText', stateBlog.contentText)
      formData.append('categoryBlog', getIdFromURLNameAndId(idBlog))
      const resBlog = await updateBlogMutation.mutateAsync(formData)
      if (resBlog) {
        toast.success(resBlog.data?.message, {
          position: 'top-center',
          autoClose: 1000
        })
        // form.resetFields()
        // setSelectedImage('')
        // setstateBlog(initStates())
        navigate(`/system/categoryBlog/${idBlog}`)
      } else {
        toast.error(resBlog.data?.message, {
          position: 'top-center',
          autoClose: 3000
        })
      }
    } else if (submit === 'create') {
      const formData = new FormData()
      formData.append('title', stateBlog.title)
      formData.append('img', stateBlog.img)
      formData.append('contentHTML', stateBlog.contentHTML)
      formData.append('contentText', stateBlog.contentText)
      formData.append('categoryBlog', getIdFromURLNameAndId(idBlog))
      const resBlog = await createBlogMutation.mutateAsync(formData)
      if (resBlog) {
        toast.success(resBlog.data?.message, {
          position: 'top-center',
          autoClose: 1000
        })
        form.resetFields()
        setSelectedImage('')
        setstateBlog(initStates())
        navigate(`/system/categoryBlog/${idBlog}`)
      } else {
        toast.error(resBlog.data?.message, {
          position: 'top-center',
          autoClose: 3000
        })
      }
    } else {
      toast.error('có lỗi...', {
        position: 'top-center',
        autoClose: 3000
      })
    }
  }
  return (
    <div>
      {createBlogMutation.isLoading || updateBlogMutation.isLoading ? (
        <Spinner />
      ) : (
        <>
          {codeBlog && DataBlog && (
            <>
              <h2 className='text-xl font-semibold py-4'>Cập nhật bài viết</h2>
              <Form
                name='basic'
                labelCol={{
                  span: 2
                }}
                wrapperCol={{
                  span: 20
                }}
                form={form}
                autoComplete='off'
                onFinish={handleOnFinish}
              >
                {/* tên sản phẩm */}
                <Form.Item
                  label='Tiêu đề'
                  name='title'
                  initialValue={DataBlog.data?.data.title}
                  rules={[
                    {
                      required: true,
                      message: 'Nhập tiêu đề sản phẩm!'
                    }
                  ]}
                >
                  <InputComponent
                    placeholder='Tiêu đề sản phẩm'
                    value={stateBlog.title}
                    onChange={handleInputChange}
                    name='title'
                  />
                </Form.Item>
                {/* Ảnh Chính  */}
                <Form.Item
                  label='Ảnh Chính'
                  name='image'
                  initialValue={DataBlog.data?.data.img}
                  rules={[{ required: true, message: 'Ảnh Chính Của Bài Viết' }]}
                >
                  <div>
                    <InputComponent accept='.jpg,.jpeg,.png' type='file' onChange={handleImageChange} name='img' />

                    <img
                      style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                      src={selectedImage ? selectedImage : DataBlog.data?.data.img}
                      alt='Selected'
                      className='mt-2'
                    />
                  </div>
                </Form.Item>
                <span className='font-sans text-xl'>Nội Dung</span>
                <MdEditor
                  value={stateBlog.contentText}
                  style={{ height: '500px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                  name='content'
                />

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16
                  }}
                  name='update'
                >
                  <Button
                    type='default'
                    htmlType='submit'
                    name='update'
                    value='update'
                    style={{
                      backgroundColor: 'blue',
                      color: 'white',
                      width: '100px',
                      height: '50px',
                      fontSize: '15px'
                    }}
                  >
                    Lưu
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
          {!codeBlog && (
            <>
              <h2 className='text-xl font-semibold py-4'>Thêm mới bài viết </h2>
              <Form
                name='basic'
                labelCol={{
                  span: 2
                }}
                wrapperCol={{
                  span: 20
                }}
                form={form}
                autoComplete='off'
                onFinish={handleOnFinish}
              >
                {/* tên sản phẩm */}
                <Form.Item
                  label='Tiêu đề'
                  name='title'
                  initialValue={DataBlog && DataBlog.data?.data.title}
                  rules={[
                    {
                      required: true,
                      message: 'Nhập tiêu đề sản phẩm!'
                    }
                  ]}
                >
                  <InputComponent
                    placeholder='Tiêu đề sản phẩm'
                    value={stateBlog.title}
                    onChange={handleInputChange}
                    name='title'
                  />
                </Form.Item>
                {/* Ảnh Chính  */}
                <Form.Item
                  label='Ảnh Chính'
                  name='image'
                  rules={[{ required: true, message: 'Ảnh Chính Của Bài Viết' }]}
                >
                  <div>
                    <InputComponent accept='.jpg,.jpeg,.png' type='file' onChange={handleImageChange} name='img' />
                    {selectedImage && (
                      <img
                        style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                        src={selectedImage}
                        alt='Selected'
                        className='mt-2'
                      />
                    )}
                  </div>
                </Form.Item>
                <span className='font-sans text-xl'>Nội Dung</span>
                <MdEditor
                  value={stateBlog.contentText}
                  style={{ height: '500px' }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                  name='content'
                />

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16
                  }}
                  name='create'
                >
                  <Button
                    type='default'
                    htmlType='submit'
                    style={{
                      backgroundColor: 'blue',
                      color: 'white',
                      width: '100px',
                      height: '50px',
                      fontSize: '15px'
                    }}
                  >
                    Lưu
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </>
      )}
    </div>
  )
}
