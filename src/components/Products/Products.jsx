import React, { useState } from 'react'
import ProductAPI from '../../apis/produts.api'
import { useQuery } from '@tanstack/react-query'
import RenderProduct from '../RenderProduct/RenderProduct'
import { Select } from 'antd'
import { useEffect } from 'react'

export default function Products() {
  // getAllProducts
  const { data: ProductData, refetch } = useQuery({
    queryKey: ['getProducts'],
    queryFn: ProductAPI.getAllProducts
  })
  const [options, setOptions] = useState([])
  const [dataFilter, setdataFilter] = useState([])

  const resProductData = ProductData?.data?.data

  useEffect(() => {
    resProductData &&
      setOptions(
        resProductData.map((option) => ({
          value: option._id,
          label: option.name
        }))
      )
  }, [resProductData])

  const handleChange = (value) => {
    setdataFilter(value)
  }

  const dataAfterFilter = resProductData && resProductData.filter((item) => dataFilter.includes(item._id))

  return (
    <div className='px-2'>
      <div className='mt-3'>
        <div className='flex justify-around p-2'>
          <h2 className='text-left pt-2 font-sans text-gray-600 mr-10'>Quản Lý Sản Phẩm</h2>
          <Select
            mode='tags'
            style={{
              width: '50%'
            }}
            onChange={handleChange}
            tokenSeparators={[',']}
            options={options}
            placeholder='Chọn Danh Mục Sản Phẩm'
          />
        </div>
        <div className='h-[2px] w-10px bg-white'></div>
      </div>

      <div className='p-2'>
        <div className=' overflow-x-auto shadow-md sm:rounded-lg '>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Tên Sản Phẩm
                </th>
                <th scope='col' className='px-6 py-3'>
                  Giá
                </th>
                <th scope='col' className='px-6 py-3'>
                  Giá Khuyến Mãi
                </th>
                <th scope='col' className='px-6 py-3'>
                  Số Lượng
                </th>
                <th scope='col' className='px-6 py-3'>
                  Mô Tả
                </th>
                <th scope='col' className='px-6 py-3'>
                  Ảnh Chính
                </th>
                <th scope='col' className='px-6 py-3'>
                  Ảnh Phụ
                </th>
                <th scope='col' className='px-6 py-3'>
                  Hành Động
                </th>
              </tr>
            </thead>
            {dataFilter.length > 0 ? (
              <tbody>
                {dataAfterFilter &&
                  dataAfterFilter.map((item) => (
                    <RenderProduct key={item._id} idCategory={item._id} name={item.name} products={item.products} />
                  ))}
              </tbody>
            ) : (
              <tbody>
                {resProductData &&
                  resProductData.map((item) => (
                    <RenderProduct key={item._id} idCategory={item._id} name={item.name} products={item.products} />
                  ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
