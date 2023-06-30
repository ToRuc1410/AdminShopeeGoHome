import useQueryParams from './useQueryParams'

export default function useQueryConfig() {
  // ====================== gửi data lên api
  // queryKey nhận vào tham số thứ 2 là: queryParams
  //nếu có sự thay đổi thì nó sẽ re-render hàm useQuery và cho lại data mới
  const queryParams = useQueryParams()
  // loại bỏ những thuộc tính khi chạy cho ra undefined
  const queryConfig = {
    status: queryParams.status || '',
    payMent: queryParams.payMent || '',
    code: queryParams.code || ''
  }

  return queryConfig
}
