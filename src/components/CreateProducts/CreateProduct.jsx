import React, { useEffect, useState } from 'react'
import { Button, Form, Space } from 'antd'
import InputComponent from '../InputComponent/InputComponent'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css'
import { useParams } from 'react-router-dom'
import ProductAPI from '../../apis/produts.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useForm } from 'antd/es/form/Form'
import Spinner from '../Spinner/Spinner'
import { NumericFormat } from 'react-number-format'
import { removeCommas } from '../../pages/Utils/utils'

import socket from '../../constant/socket'

export default function CreateProduct() {
  const initStates = () => ({
    name: '',
    quantity: '',
    price: '',
    price_before_discount: 0,
    descriptionHTML: '',
    descriptionText: '',
    detailProductHTML: '',
    detailProductText: '',
    image: null,
    images: [],
    height: '',
    length: '',
    weight: '',
    width: ''
  })
  const [form] = useForm()
  const mdParser = new MarkdownIt(/* Markdown-it options */)
  const [stateProducts, setStateProducts] = useState(initStates())
  const [selectedImage, setSelectedImage] = useState('')
  const [description, setDescription] = useState('')
  // const [detailProduct, setDetailProduct] = useState('')
  const [imageURLs, setImageURLs] = useState([])
  const { idCategory } = useParams()

  ////// ======================================validate form

  const validatePrice = (_, value) => {
    const priceBeforeDiscount = parseFloat(form.getFieldValue('price_before_discount').replace(/,/g, ''))
    const salePrice = parseFloat(value.replace(/,/g, ''))
    if (salePrice >= priceBeforeDiscount) {
      return Promise.reject(new Error('Giá giảm không thể lớn hơn hoặc bằng giá gốc'))
    } else {
      return Promise.resolve()
    }
  }
  /////============================================function
  // Finish!
  const handleEditorChange = ({ html, text }) => {
    setStateProducts({
      ...stateProducts,
      descriptionHTML: html,
      descriptionText: text
    })
    setDescription(text)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setStateProducts({ ...stateProducts, [name]: value })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    // const fileImage = await getBase64(file)
    setSelectedImage(URL.createObjectURL(file))
    setStateProducts({ ...stateProducts, image: file })
  }

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files)
    // fileimages: array này =>Base64 để post lên server
    // const fileimages = await convertImagesToBase64(files)
    setImageURLs([]) // Xóa tất cả các URL tạm thời của ảnh hiện tại
    setStateProducts((prevFormData) => ({
      ...prevFormData,
      images: files
    }))
    //files: array dùng để views
    const urls = files.map((file) => URL.createObjectURL(file))
    setImageURLs(urls) // Lưu trữ URL tạm thời của các ảnh mới
  }
  useEffect(() => {
    return () => {
      imageURLs.forEach(URL.revokeObjectURL)
    }
  }, [imageURLs])

  const createProductMutation = useMutation(ProductAPI.createProduct)
  const handleOnFinish = async () => {
    console.log(stateProducts)
    const {
      name,
      quantity,
      price,
      price_before_discount,
      descriptionHTML,
      descriptionText,
      image,
      images,
      height,
      length,
      weight,
      width
    } = stateProducts
    const formData = new FormData()
    formData.append('name', name)
    formData.append('quantity', removeCommas(quantity))
    formData.append('price', removeCommas(price))
    formData.append('height', height)
    formData.append('length', length)
    formData.append('weight', removeCommas(weight))
    formData.append('width', width)
    formData.append('image', image)
    formData.append('categoryId', idCategory)
    formData.append('price_before_discount', removeCommas(price_before_discount))
    formData.append('descriptionHTML', descriptionHTML)
    formData.append('descriptionText', descriptionText)
    // formData.append('detailProductHTML', detailProductHTML)
    // formData.append('detailProductText', detailProductText)
    images.forEach((image, index) => {
      images[formData.append(`images[${index}]`, image)]
    })
    const rescreateProductMutation = await createProductMutation.mutateAsync(formData)
    if (rescreateProductMutation) {
      socket.emit('addProduct')
      toast.success(rescreateProductMutation.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
      form.resetFields()
      setDescription('')

      setSelectedImage('')
      setImageURLs([])
    } else {
      toast.error(rescreateProductMutation.data?.message, {
        position: 'top-center',
        autoClose: 3000
      })
    }
  }
  return (
    <div className='p-4 bg-gray-300'>
      <div className='mt-3'>
        <h2 className='text-left pt-4 font-sans text-gray-600'>Thêm Mới Sản Phẩm</h2>
        <div className='h-[2px] w-10px bg-white'></div>
      </div>
      {createProductMutation.isLoading ? (
        <Spinner />
      ) : (
        <Form
          name='basic'
          labelCol={{
            span: 10
          }}
          wrapperCol={{
            span: 20
          }}
          form={form}
          autoComplete='off'
          onFinish={handleOnFinish}
        >
          <div className='bg-white p-2 rounded-md'>
            <div className='flex justify-start '>
              <div className='w-[50%]'>
                {/* tên sản phẩm */}
                <Form.Item
                  label='Tên Sản Phẩm'
                  name={['form', 'name']}
                  rules={[
                    {
                      required: true,
                      message: 'Nhập tên sản phẩm!'
                    }
                  ]}
                >
                  <InputComponent
                    placeholder='Nhập tên sản phẩm'
                    value={stateProducts.name}
                    onChange={handleInputChange}
                    name='name'
                  />
                </Form.Item>
              </div>
              <div className='w-[50%]'>
                {/* số lượng sản phẩm */}
                <Form.Item
                  label='Nhập Số Lượng Sản Phẩm'
                  name={['form', 'quantity']}
                  rules={[
                    {
                      required: true,
                      message: 'Nhập Số Lượng Sản Phẩm'
                    },
                    { pattern: /^\d+(,\d+)*$/, message: 'Giá trị không hợp lệ. Vui lòng chỉ nhập số.' }
                  ]}
                >
                  <NumericFormat
                    placeholder='nhập số lượng sản phẩm'
                    value={stateProducts.quantity}
                    onChange={handleInputChange}
                    name='quantity'
                    allowLeadingZeros
                    thousandSeparator=','
                    className='border border-gray-300 w-full rounded h-8 outline-none px-3'
                  />
                  {/* <InputComponent value={stateProducts.quantity} onChange={handleInputChange} name='quantity' /> */}
                </Form.Item>
              </div>
            </div>
            <div className='flex justify-start'>
              <div className='w-[50%]'>
                {/* Giá bán */}
                <Form.Item
                  label='Nhập Giá Gốc'
                  name='price_before_discount'
                  rules={[
                    {
                      required: true,
                      message: 'Nhập Giá Sản Phẩm'
                    },
                    { pattern: /^\d+(,\d+)*$/, message: 'Giá trị không hợp lệ. Vui lòng chỉ nhập số.' }
                  ]}
                  hasFeedback
                >
                  <NumericFormat
                    placeholder='Nhập giá gốc'
                    value={stateProducts.price_before_discount}
                    onChange={handleInputChange}
                    name='price_before_discount'
                    allowLeadingZeros
                    thousandSeparator=','
                    className='border border-gray-300 w-full rounded h-8 outline-none px-3'
                  />
                </Form.Item>
              </div>
              <div className='w-[50%]'>
                {/* giá sale */}
                <Form.Item
                  label='Nhập Giá Sale '
                  name='price'
                  dependencies={['price_before_discount']}
                  hasFeedback
                  rules={[
                    { validator: validatePrice },
                    { pattern: /^\d+(,\d+)*$/, message: 'Giá trị không hợp lệ. Vui lòng chỉ nhập số.' }
                  ]}
                >
                  <NumericFormat
                    value={stateProducts.price}
                    placeholder='Nhập giá sale'
                    onChange={handleInputChange}
                    name='price'
                    allowLeadingZeros
                    thousandSeparator=','
                    className='border border-gray-300 w-full rounded h-8 outline-none px-3'
                  />
                  {/* <InputComponent value={stateProducts.price} onChange={handleInputChange} name='price' /> */}
                </Form.Item>
              </div>
            </div>

            <div className='flex justify-start'>
              <div className='w-[50%] h-30'>
                {/* Ảnh Chính  */}
                <Form.Item
                  label='Ảnh Chính Của Sản Phẩm'
                  name='image'
                  rules={[{ required: true, message: 'Ảnh Chính Sản Phẩm là bắt buộc' }]}
                >
                  <div>
                    <span className='text-gray-500'>Chỉ chấp nhận file có đuôi: ['jpg', 'png', 'jpeg']</span>
                    <InputComponent accept='.jpg,.jpeg,.png' type='file' onChange={handleImageChange} name='image' />
                    {selectedImage && (
                      <img style={{ width: '100px', height: '100px' }} src={selectedImage} alt='Selected' />
                    )}
                  </div>
                </Form.Item>
              </div>

              <div className='w-[50%]'>
                {/* Ảnh Phụ */}
                <Form.Item label='Ảnh Phụ Của Sản Phẩm' name='images'>
                  <div className=''>
                    <span className='text-gray-500'>Chỉ chấp nhận file có đuôi: ['jpg', 'png', 'jpeg']</span>
                    <InputComponent
                      accept='.jpg,.jpeg,.png'
                      type='file'
                      multiple
                      onChange={handleImagesChange}
                      name='images'
                    />
                    <div className='flex flex-wrap justify-around'>
                      {imageURLs.map((url, index) => (
                        <img style={{ width: '70px', height: '70px' }} key={index} src={url} alt={`Image ${index}`} />
                      ))}
                    </div>
                  </div>
                </Form.Item>
              </div>
            </div>

            <div className=''>
              <div className='flex'>
                <div className='w-[50%]'>
                  {/* Chiều cao*/}
                  <Form.Item
                    label='Nhập Chiều Cao'
                    name='height'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập chiều cao Sản Phẩm'
                      },
                      { pattern: /^\d+$/, message: 'Giá trị không hợp lệ. Vui lòng chỉ nhập số.' }
                    ]}
                    hasFeedback
                  >
                    <InputComponent
                      placeholder='cm'
                      value={stateProducts.height}
                      onChange={handleInputChange}
                      name='height'
                    />
                  </Form.Item>
                </div>
                <div className='w-[50%]'>
                  {/* Chiều Rộng */}
                  <Form.Item
                    label='Nhập Chiều Rộng '
                    name='width'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập chiều rộng Sản Phẩm'
                      },
                      { pattern: /^\d+$/, message: 'Giá trị không hợp lệ. Vui lòng chỉ nhập số.' }
                    ]}
                  >
                    <InputComponent
                      placeholder='cm'
                      value={stateProducts.width}
                      onChange={handleInputChange}
                      name='width'
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='flex'>
                <div className='w-[50%]'>
                  {/* cân nặng*/}
                  <Form.Item
                    label='Nhập cân nặng'
                    name='weight'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập cân nặng Sản Phẩm'
                      },
                      { pattern: /^\d+(,\d+)*$/, message: 'Giá trị không hợp lệ. Vui lòng chỉ nhập số.' }
                    ]}
                    hasFeedback
                  >
                    <NumericFormat
                      placeholder='gram'
                      value={stateProducts.weight}
                      onChange={handleInputChange}
                      name='weight'
                      allowLeadingZeros
                      thousandSeparator=','
                      className='border border-gray-300 w-full rounded h-8 outline-none px-3'
                    />
                  </Form.Item>
                </div>
                <div className='w-[50%]'>
                  {/* Chiều dài */}
                  <Form.Item
                    label='Nhập Chiều dài '
                    name='length'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập chiều dài Sản Phẩm'
                      },
                      { pattern: /^\d+$/, message: 'Giá trị không hợp lệ. Vui lòng chỉ nhập số.' }
                    ]}
                  >
                    <InputComponent
                      placeholder='cm'
                      value={stateProducts.length}
                      onChange={handleInputChange}
                      name='length'
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Mô tả sản phẩm */}
            <span className='text-lg'>Mô Tả Sản Phẩm</span>
            <MdEditor
              value={description}
              style={{ height: '500px' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              name='description'
            />
            <div className='mt-4'>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16
                }}
                name={['form', 'submit']}
              >
                <Space>
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
                </Space>
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </div>
  )
}
