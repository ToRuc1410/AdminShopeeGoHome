import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductAPI from '../../apis/produts.api'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatNumber } from '../../pages/Utils/utils'

export default function RenderProduct({ idCategory, name, products }) {
  const [isToggle, setIsToggle] = useState(true)
  const queryClient = useQueryClient()
  const deleteProductMutation = useMutation({
    mutationFn: ProductAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries('getProducts')
    }
  })
  const handleToggle = () => {
    setIsToggle(!isToggle)
  }
  const handleDeleteProduct = async (idProduct) => {
    const confirmation = window.confirm('Bạn có chắc Xoá Sản Phẩm này không?')
    if (confirmation) {
      const resDeleteCategory = await deleteProductMutation.mutateAsync(idProduct)
      if (resDeleteCategory) {
        toast.success(resDeleteCategory?.data.message, {
          position: 'top-center',
          autoClose: 1000
        })
      } else {
        toast.error(resDeleteCategory?.data.message, {
          position: 'top-center',
          autoClose: 1000
        })
      }
    }
  }
  const reProducts = [...products].reverse()
  return (
    <>
      <tr className=' text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 border-t-2 '>
        <th colSpan='7' className='px-6 py-2 cursor-pointer'>
          <button className='flex bg-blue-200 px-5 py-2 rounded-md' onClick={handleToggle}>
            <span>{name}</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-4 h-4 ml-2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5'
              />
            </svg>
          </button>
        </th>
        <th colSpan='1' className='px-6 py-2'>
          <Link to={`/system/products/product/${idCategory}`}>
            <button className='bg-blue-300 text-sm rounded-full p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
              </svg>
            </button>
          </Link>
        </th>
      </tr>
      {isToggle && (
        <>
          {reProducts.map((product) => (
            <tr
              className='transition-opacity duration-1000 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              key={product._id}
            >
              <th className='px-6 font-medium text-gray-900 line-clamp-5 flex-wrap dark:text-white'>{product.name}</th>
              <td className='px-6 py-2'>{`đ${formatNumber(product.price_before_discount)}`}</td>
              <td className='px-6 py-2'>{product.price !== 0 ? `đ${formatNumber(product.price)}` : '_'}</td>
              <td className='px-6 py-2'>{formatNumber(product.quantity)}</td>
              <td className='px-6 py-2'>{formatNumber(product.sold ? product.sold : 0)}</td>
              <td className='px-6 line-clamp-3'>{product.descriptionText}</td>
              <td className='py-2'>
                <img src={product.image.path} alt={product.name} className='h-20 w-20' />
              </td>
              <td className='py-4 flex flex-wrap justify-around '>
                {product.images.map((image, index) => (
                  <img key={index} src={image.path} alt={`image ${index} `} className='h-10 w-10 object-cover' />
                ))}
              </td>
              <td className='py-4 '>
                <button
                  className='flex text-center flex-col text-xs w-full mb-2 text-blue-600 dark:text-blue-500 mr-3 hover:bg-gray-200 p-2 rounded-sm underline-none'
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Xóa
                </button>
                <Link
                  to={`/system/products/update/${product._id}`}
                  className='flex flex-col text-xs text-blue-600 dark:text-blue-500 hover:bg-gray-200 p-2 rounded-sm underline-none'
                >
                  Chỉnh Sửa
                </Link>
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  )
}
