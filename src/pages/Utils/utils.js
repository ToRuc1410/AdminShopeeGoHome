import numeral from 'numeral'

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  }
}
// Format những kí tự đặc biệt có thể có trên URL
const removeSpecialCharacter = (str) => {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')
}
// Xử lý URL cho name thân thiện để SEO trên google
export const generateURLNameAndId = (name, id) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `_${id}`
}
// get Id từ string URL
export const getIdFromURLNameAndId = (nameId) => {
  const arr = nameId.split('_')
  return arr[arr.length - 1]
}

// Hàm để lấy name từ chuỗi đã xử lý
export const getNameFromGeneratedURL = (generatedURL) => {
  // Tách phần name từ chuỗi đã tạo
  const nameWithId = generatedURL.split('_')[0]

  // Loại bỏ các dấu gạch nối và chuyển khoảng trắng thành dấu cách
  const name = nameWithId.replace(/-/g, ' ')

  return name
}
// format giá tiền
export const formatNumber = (value) => {
  const formattedValue = numeral(value).format('0,0')
  return formattedValue
}
export const calculatePrice = (products) => {
  let total = 0
  products.forEach((product) => {
    if (product.price !== 0) {
      total += product.price * product.buy_count
    } else {
      total += product.price_before_discount * product.buy_count
    }
  })
  return total
}
export const hanldeTime = (time) => {
  const minutes = Math.floor(time / (1000 * 60))
  // Chuyển đổi sang giờ nếu không đủ phút
  if (minutes < 60) {
    return `${minutes} phút trước`
  } // Chuyển đổi sang giờ
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} giờ trước`
  }
  // Chuyển đổi sang ngày/tháng/năm
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}
export const removeCommas = (number) => {
  // Loại bỏ tất cả dấu phẩy từ chuỗi
  return number.replace(/,/g, '')
}
