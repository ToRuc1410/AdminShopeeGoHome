import React, { useContext, useState } from 'react'
import { Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import authAPI from '../../apis/auth.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AppContext } from '../../contexts/app.context'

export default function Login() {
  const initStates = () => ({
    email: '',
    password: ''
  })
  const { SetIsAuthenticated, setProfile } = useContext(AppContext)
  const [stateForm, setStateForm] = useState(initStates())
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: authAPI.loginAdmin
  })
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setStateForm({ ...stateForm, [name]: value })
  }
  const onFinish = async () => {
    const resLoginMutation = await loginMutation.mutateAsync({ ...stateForm })
    if (resLoginMutation) {
      // nếu thành công thì set nó thành setIsAuthenticated=true và vào mainlayout
      SetIsAuthenticated(true)
      // và setProfile data User vào localStorage
      console.log(resLoginMutation)
      setProfile(resLoginMutation.data.data.user)
      navigate('/system/orders')
    }
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <img
          className='mx-auto h-20 w-50 bg-gray-200 rounded-sm'
          src='https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=819.000032544136,fit=crop/YbNbPPqn2EfwxjP7/chat-hon-to-cu-1-png-m7V2704oB7HDV1b2.png'
          alt='GoMoHo'
        />
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700 font-body ml-10'>
          Đăng Nhập Tài Khoảng
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
            label='Email'
            name='username'
            rules={[
              {
                required: true,
                message: 'Nhập tên tài khoảng!'
              },
              {
                type: 'email',
                message: 'Email Không đúng định dạng'
              }
            ]}
          >
            <Input name='email' value={stateForm.email} onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[
              {
                required: true,
                message: 'Nhập mật khẩu!'
              }
            ]}
          >
            <Input.Password name='password' value={stateForm.password} onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            className='hover:text-blue-400 text-gray-600 border-b border-b-blue-400 text-right'
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <Link to='/system/forgotpassword'> Quên Mật Khẩu</Link>
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
    </div>
  )
}
