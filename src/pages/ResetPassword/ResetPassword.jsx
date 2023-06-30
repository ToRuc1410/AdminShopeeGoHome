import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import authAPI from '../../apis/auth.api'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 8
      }
    },
    wrapperCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 16
      }
    }
  }
  const navigate = useNavigate()
  const { resetPassword } = useParams()
  const resetPassMutation = useMutation({
    mutationFn: authAPI.resetPassword
  })

  const onFinish = async (values) => {
    const resResetPassMutation = await resetPassMutation.mutateAsync({
      token: resetPassword,
      password: values.password
    })
    //     const resData = await sendEmailMutation.mutateAsync(email)
    if (resResetPassMutation) {
      console.log(resResetPassMutation)
      toast.success(resResetPassMutation?.data?.message)
      navigate('/system/orders')
    }
  }
  console.log(resetPassword)
  return (
    <>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <img
          className='mx-auto h-20 w-50 bg-gray-200 rounded-sm'
          src='https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=819.000032544136,fit=crop/YbNbPPqn2EfwxjP7/chat-hon-to-cu-1-png-m7V2704oB7HDV1b2.png'
          alt='GoMoHo'
        />
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700 font-body ml-10'>
          Cập Nhật Lại Password
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <Form
          {...formItemLayout}
          form={form}
          name='register'
          onFinish={onFinish}
          style={{
            maxWidth: 600
          }}
          scrollToFirstError
        >
          <Form.Item
            name='password'
            label='Password'
            rules={[
              {
                required: true,
                message: 'Nhập Password là bắt buộc'
              }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name='confirm'
            label='Confirm Password'
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Nhập lại Password là bắt buộc'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật Khẩu Không khớp'))
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className='float-right'>
            <Form.Item>
              <Button type='default' htmlType='submit'>
                Gửi
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  )
}
