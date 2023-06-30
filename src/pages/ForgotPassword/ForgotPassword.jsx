import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import authAPI from '../../apis/auth.api'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner/Spinner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const sendEmailMutation = useMutation({
    mutationFn: authAPI.sendMail
  })
  const onFinish = async () => {
    const resCreateCategoryMutation = await sendEmailMutation.mutateAsync({ email: email })
    //     const resData = await sendEmailMutation.mutateAsync(email)
    if (resCreateCategoryMutation) {
      toast.success(resCreateCategoryMutation?.data?.message)
    }
  }
  const handleOnChange = (e) => {
    setEmail(e.target.value)
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      {sendEmailMutation.isLoading ? (
        <Spinner text={'Đang check Mail....'} />
      ) : (
        <>
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <img
              className='mx-auto h-20 w-50 bg-gray-200 rounded-sm'
              src='https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=819.000032544136,fit=crop/YbNbPPqn2EfwxjP7/chat-hon-to-cu-1-png-m7V2704oB7HDV1b2.png'
              alt='GoMoHo'
            />
            <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700 font-body ml-10'>
              Quên mật khẩu
            </h2>
          </div>

          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <Form
              name='basic'
              labelCol={{
                span: 8
              }}
              wrapperCol={{
                span: 16
              }}
              style={{
                maxWidth: 700
              }}
              initialValues={{
                remember: true
              }}
              onFinish={onFinish}
              autoComplete='off'
            >
              <Form.Item
                label='Nhập email'
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Nhập email là bắt buộc'
                  },
                  {
                    type: 'email',
                    message: 'Email Không đúng định dạng'
                  }
                ]}
              >
                <Input name='email' value={email} onChange={handleOnChange} />
              </Form.Item>

              <Form.Item
                className='hover:text-blue-400 text-gray-600 border-b border-b-blue-400 text-right'
                wrapperCol={{
                  offset: 8,
                  span: 16
                }}
              >
                <Link to='/system/login'>Đăng nhập</Link>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16
                }}
              >
                <Button type='primary' className='bg-blue-800 hover:bg-blue-400' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </div>
  )
}
