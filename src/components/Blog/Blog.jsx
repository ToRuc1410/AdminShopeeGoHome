import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Table } from 'antd'
import { NavLink, useParams } from 'react-router-dom'
import { getIdFromURLNameAndId, getNameFromGeneratedURL } from '../../pages/Utils/utils'
import { MenuOutlined } from '@ant-design/icons'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import blogsAPI from '../../apis/blogs.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

const Row = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key']
  })
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1
      }
    ),
    transition,
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 9999
        }
      : {})
  }
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === 'sort') {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: 'none',
                  cursor: 'move'
                }}
                {...listeners}
              />
            )
          })
        }
        return child
      })}
    </tr>
  )
}
export default function Blog() {
  const { idBlog } = useParams()
  const [dataSource, setDataSource] = useState([])
  const [isDataChanged, setIsDataChanged] = useState(false)

  const { data: DataBlogs, refetch } = useQuery({
    queryKey: ['getAllBlogs'],
    queryFn: () => blogsAPI.getAllBlogs(getIdFromURLNameAndId(idBlog))
  })
  const updateBlogsMutation = useMutation({
    mutationFn: blogsAPI.updateBlogs,
    onSuccess: () => {
      setIsDataChanged(false)
    }
  })
  const deleteBlogMutation = useMutation({
    mutationFn: blogsAPI.deleteBlog,
    onSuccess: () => {
      refetch()
    }
  })

  useEffect(() => {
    if (DataBlogs && DataBlogs.data) {
      const lengthData = DataBlogs.data?.data

      const formattedData = lengthData.map((item) => ({
        key: String(item.order),
        code: item._id,
        img: item.img.path,
        title: item.title,
        content: item.contentText
      }))

      setDataSource(formattedData)
    }
  }, [DataBlogs])

  const handleSetChangeData = async () => {
    const dataBlogs = dataSource.map((item, index) => ({ order: index + 1, code: item.code }))
    const resUpdateBlogs = await updateBlogsMutation.mutateAsync(dataBlogs)
    if (resUpdateBlogs) {
      toast.success(resUpdateBlogs.data?.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  }

  const hanldeDeleteBlog = async (id) => {
    const confirmation = window.confirm('Bạn có chắc Xoá danh Mục và Sản Phẩm trong Danh Mục đó không?')
    if (confirmation) {
      const resDeleteBlog = await deleteBlogMutation.mutateAsync(id)
      if (resDeleteBlog) {
        toast.success(resDeleteBlog?.data.message, {
          position: 'top-center',
          autoClose: 1000
        })
      }
    }
  }

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id)
        const overIndex = previous.findIndex((i) => i.key === over?.id)
        return arrayMove(previous, activeIndex, overIndex)
      })
      setIsDataChanged(true)
    } else {
      setIsDataChanged(false)
    }
  }
  const columns = [
    {
      key: 'sort'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'img',
      render: (t, r) => <img className='h-24 w-24 object-contain' src={`${r.img}`} alt={`${r.title}`} />
    },
    {
      title: 'Tiêu đề chính',
      dataIndex: 'title',
      render: (t, r) => <p className='line-clamp-3 line-clamp-ellipsis max-w-xs'>{`${r.title}`}</p>
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      render: (t, r) => <p className='line-clamp-3 line-clamp-ellipsis max-w-xs'>{`${r.content}`}</p>
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (t, r) => (
        <>
          <button className='' onClick={() => hanldeDeleteBlog(r.code)}>
            Xóa
          </button>
          <NavLink to={`/system/categoryBlog/${idBlog}/${r.code}`}>
            <Button type='default' className='bg-blue-300 h-10 m-2'>
              Chỉnh sửa
            </Button>
          </NavLink>
        </>
      )
    }
  ]
  return (
    <>
      <div className='flex justify-between m-2'>
        <Breadcrumb
          className='mx-2'
          items={[
            {
              href: '/system/categoryBlog',
              title: (
                <>
                  <span className=' px-2'>Danh mục Tin Tức</span>
                </>
              )
            },
            {
              title: `${getNameFromGeneratedURL(idBlog)}`
            }
          ]}
        />
        <NavLink to={`/system/categoryBlog/${idBlog}/new_blog`}>
          <Button type='default' className='bg-blue-300 h-10 m-2'>
            Tạo mới
          </Button>
        </NavLink>
      </div>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={dataSource.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row
              }
            }}
            rowKey='key'
            columns={columns}
            dataSource={dataSource}
          />
          {isDataChanged && (
            <Button className='float-right px-6 mx-2 mb-2 bg-blue-500 ' type='primary' onClick={handleSetChangeData}>
              Lưu
            </Button>
          )}
        </SortableContext>
      </DndContext>
    </>
  )
}
