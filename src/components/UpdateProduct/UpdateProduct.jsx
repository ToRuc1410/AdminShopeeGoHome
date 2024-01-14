import React, { useEffect, useState } from 'react'
import { Button, Form, Space } from 'antd'
import InputComponent from '../InputComponent/InputComponent'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import ProductAPI from '../../apis/produts.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'antd/es/form/Form'
import Spinner from '../Spinner/Spinner'
import { toast } from 'react-toastify'
import { removeCommas } from '../../pages/Utils/utils'
import { NumericFormat } from 'react-number-format'
export default function UpdateProduct() {
  const initStates = () => ({
    name: '',
    quantity: '',
    categoryId: '',
    price: '',
    price_before_discount: 0,
    descriptionHTML: '',
    descriptionText: '',
    detailProductHTML: '',
    detailProductText: '',
    image: null,
    productId: '',
    images: [],
    height: '',
    length: '',
    weight: '',
    width: ''
  })
  const navigate = useNavigate()
  const [form] = useForm()
  const mdParser = new MarkdownIt(/* Markdown-it options */)
  const [stateProducts, setStateProducts] = useState(initStates())
  const [selectedImage, setSelectedImage] = useState('')
  const [description, setDescription] = useState('')
  const [imageURLs, setImageURLs] = useState([])
  const { idProduct } = useParams()
  ///====================validate Form
  const validatePrice = (_, value) => {
    const priceBeforeDiscount = parseFloat(form.getFieldValue('price_before_discount').replace(/,/g, ''))
    const salePrice = parseFloat(value.replace(/,/g, ''))
    if (salePrice >= priceBeforeDiscount) {
      return Promise.reject(new Error('Giá giảm không thể lớn hơn hoặc bằng giá gốc'))
    } else {
      return Promise.resolve()
    }
  }
  //==========================Api: getDetailProduct
  const { data: ProductData, refetch } = useQuery({
    queryKey: ['getProduct', idProduct],
    queryFn: () => {
      return ProductAPI.getDetailProduct(idProduct)
    }
  })
  const resProductData = ProductData?.data?.data
  useEffect(() => {
    resProductData &&
      setStateProducts((prevState) => ({
        ...prevState,
        name: resProductData.name,
        quantity: resProductData.quantity.toString(),
        price: resProductData.price.toString(),
        price_before_discount: resProductData.price_before_discount.toString(),
        descriptionHTML: resProductData.descriptionHTML,
        descriptionText: resProductData.descriptionText,
        detailProductHTML: resProductData.detailProductHTML,
        detailProductText: resProductData.detailProductText,
        image: resProductData.image,
        categoryId: resProductData.category,
        productId: resProductData._id,
        images: resProductData.images,
        height: resProductData.height,
        length: resProductData.length,
        weight: resProductData.weight.toString(),
        width: resProductData.width
      }))
  }, [resProductData])

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
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
      setStateProducts({ ...stateProducts, image: file })
    } else {
      setStateProducts({ ...stateProducts, image: file })
    }
  }

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files)
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

  // const updateProductMutation = useMutation(ProductAPI.updateProduct)
  const updateProductMutation = useMutation((formData) => ProductAPI.updateProduct(stateProducts.productId, formData))
  const handleOnFinish = async () => {
    const formData = new FormData()
    formData.append('name', stateProducts.name)
    formData.append('quantity', removeCommas(stateProducts.quantity))
    formData.append('price', removeCommas(stateProducts.price))
    formData.append('height', stateProducts.height)
    formData.append('length', stateProducts.length)
    formData.append('weight', removeCommas(stateProducts.weight))
    formData.append('width', stateProducts.width)
    formData.append('image', stateProducts.image)
    formData.append('categoryId', stateProducts.categoryId)
    formData.append('price_before_discount', removeCommas(stateProducts.price_before_discount))
    formData.append('descriptionHTML', stateProducts.descriptionHTML)
    formData.append('descriptionText', stateProducts.descriptionText)
    formData.append('detailProductHTML', stateProducts.detailProductHTML)
    formData.append('detailProductText', stateProducts.detailProductText)
    stateProducts.images.forEach((image, index) => {
      stateProducts.images[formData.append(`images[${index}]`, image)]
    })
    const resUpdateProductMutation = await updateProductMutation.mutateAsync(formData)
    if (resUpdateProductMutation) {
      toast.success(resUpdateProductMutation.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
      navigate('/system/products')
    } else {
      toast.error(resUpdateProductMutation.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  }
  return (
    <div className='p-4 bg-gray-300'>
      <div className='mt-3'>
        <h2 className='text-left pt-4 font-sans text-gray-600'>Cập nhật Sản Phẩm</h2>
        <div className='h-[2px] w-10px bg-white'></div>
      </div>
      {updateProductMutation.isLoading ? (
        <Spinner />
      ) : (
        <>
          {resProductData && (
            <Form
              name='validate_other'
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
                      name='name'
                      initialValue={resProductData.name}
                      rules={[
                        {
                          required: true,
                          message: 'Nhập tên sản phẩm!'
                        }
                      ]}
                    >
                      <InputComponent value={stateProducts.name} onChange={handleInputChange} name='name' />
                    </Form.Item>
                  </div>
                  <div className='w-[50%]'>
                    {/* số lượng sản phẩm */}

                    <Form.Item
                      label='Nhập Số Lượng Sản Phẩm'
                      initialValue={resProductData.quantity.toString()}
                      name='quantity'
                      rules={[
                        { required: true, message: 'Vui lòng nhập giá trị.' },
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
                    </Form.Item>
                  </div>
                </div>
                <div className='flex justify-start'>
                  <div className='w-[50%]'>
                    {/* giá Bán */}
                    <Form.Item
                      label='Nhập Giá Bán '
                      name='price_before_discount'
                      hasFeedback
                      initialValue={resProductData.price_before_discount.toString()}
                      rules={[
                        {
                          required: true,
                          message: 'Nhập Giá Sản Phẩm'
                        },
                        { pattern: /^\d+(,\d+)*$/, message: 'Giá trị không hợp lệ. Vui lòng chỉ nhập số.' }
                      ]}
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
                    {/* Giá bán */}
                    <Form.Item
                      label='Nhập Giá Sale Sản Phẩm'
                      name='price'
                      dependencies={['price_before_discount']}
                      hasFeedback
                      initialValue={resProductData.price.toString()}
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
                    </Form.Item>
                  </div>
                </div>
                <div className='flex justify-start'>
                  <div className='w-[50%] h-30'>
                    {/* Ảnh Chính  */}
                    <Form.Item
                      label='Ảnh Chính Của Sản Phẩm'
                      name={['form', 'image']}
                      initialValue={resProductData.image}
                      rules={[{ required: true, message: 'Ảnh Chính Sản Phẩm là bắt buộc' }]}
                    >
                      <div>
                        <span className='text-gray-500'>Chỉ chấp nhận file có đuôi: ['jpg', 'png', 'jpeg']</span>
                        <InputComponent
                          accept='.jpg,.jpeg,.png'
                          type='file'
                          onChange={handleImageChange}
                          name='image'
                        />
                        <img
                          style={{ width: '100px', height: '100px' }}
                          src={selectedImage ? selectedImage : resProductData.image}
                          alt='Selected'
                        />
                      </div>
                    </Form.Item>
                  </div>

                  <div className='w-[50%]'>
                    {/* Ảnh Phụ */}
                    <Form.Item label='Ảnh Phụ Của Sản Phẩm' name={['form', 'images']}>
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
                          {imageURLs.length > 0
                            ? imageURLs.map((url, index) => (
                                <img
                                  style={{ width: '70px', height: '70px' }}
                                  key={index}
                                  src={url}
                                  alt={`Image ${index}`}
                                />
                              ))
                            : resProductData.images.map((url, index) => (
                                <img
                                  style={{ width: '70px', height: '70px' }}
                                  key={index}
                                  src={url}
                                  alt={`Image ${index}`}
                                />
                              ))}
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                </div>
                {/*Chi Tiết sản phẩm */}
                <div className=''>
                  <div className='flex'>
                    <div className='w-[50%]'>
                      {/* Chiều cao*/}
                      <Form.Item label='Nhập Chiều Cao' name='height' initialValue={resProductData.height} hasFeedback>
                        <InputComponent value={stateProducts.height} onChange={handleInputChange} name='height' />
                      </Form.Item>
                    </div>
                    <div className='w-[50%]'>
                      {/* Chiều Rộng */}
                      <Form.Item label='Nhập Chiều Rộng ' name='width' initialValue={resProductData.width}>
                        <InputComponent value={stateProducts.width} onChange={handleInputChange} name='width' />
                      </Form.Item>
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='w-[50%]'>
                      {/* cân nặng*/}
                      <Form.Item
                        label='Nhập cân nặng (gram)'
                        name='weight'
                        initialValue={resProductData.weight}
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
                      <Form.Item label='Nhập Chiều dài ' name='length' initialValue={resProductData.length}>
                        <InputComponent value={stateProducts.length} onChange={handleInputChange} name='length' />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                {/* Mô tả sản phẩm */}
                <span className='text-lg'>Mô Tả Sản Phẩm</span>

                <MdEditor
                  value={stateProducts.descriptionText}
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
        </>
      )}
    </div>
  )
}
