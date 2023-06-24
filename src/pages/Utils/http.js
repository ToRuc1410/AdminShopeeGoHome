import axios from 'axios'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileUserFromLS,
  setRefreshTokenTokenToLS
} from './auth'

class Http {
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.instance = axios.create({
      baseURL: 'http://localhost:4000/system/',
      headers: { 'Content-Type': 'application/json' }
    })
    //request
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        // Làm gì đó với lỗi request
        return Promise.reject(error)
      }
    )

    //response
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === 'login') {
          const dataRes = response.data
          this.accessToken = dataRes.data.access_token
          this.refreshToken = dataRes.data.refresh_token

          // lưu access_token, refresh_token và priofileUser vào localStogare
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenTokenToLS(this.refreshToken)
          setProfileUserFromLS(dataRes.data.user)
        } else if (url === 'logout') {
          this.accessToken = ''
          clearLS()
        }
        // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
        // Làm gì đó với dữ liệu response
        return response
      },
      (error) => {
        // check nếu lỗi k nằm trong 2 trường hợp này
        if (![422, 401].includes(error.response?.status)) {
          const data = error.response?.data
          const message = data?.message || 'Máy chủ đang quá tải vui lòng thử lại sau'
          console.log(message)
        }
        // if ([401].includes(error.response?.status)) {
        //   const config = error.response?.config || { headers: {} }
        //   const { url } = config
        //   //Trường hợp: - lỗi do Token hết hạn và request đó k phải là request refesh token
        //   // thì ta mới tiên hành gọi refesh token
        //   if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
        //     // thì chúng ta sẽ tiến hành gọi lại refesh token
        //     // Hạn chế gọi 2 lần handleRefreshToken
        //     this.refreshTokenRequest = this.refreshTokenRequest
        //       ? this.refreshTokenRequest
        //       : this.handleRefeshToken().finally(() => {
        //           // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
        //           setTimeout(() => {
        //             this.refreshTokenRequest = null
        //           }, 5000)
        //         })
        //     return this.refreshTokenRequest.then((accessToken) => {
        //       // chỗ này nghĩa là chúng ta gọi lại request cũ vừa bị lỗi
        //       return this.instance({ ...config, headers: { ...config.headers, Authorization: accessToken } })
        //     })
        //   }
        //   // - lỗi do Token không đúng
        //   // - lỗi do không truyền Token,
        //   // - lỗi truyền Token nhưng bị failer
        //   clearLS()
        //   this.accessToken = ''
        //   this.refreshToken = ''
        //   toast.error(error.response?.data.data?.message || error.response?.data.message)
        // }
        // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
        // Làm gì đó với lỗi response
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
