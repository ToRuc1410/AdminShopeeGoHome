import { toast } from 'react-toastify'
import http from '../pages/Utils/http'

const UserAPI = {
  async getAllUsers() {
    try {
      return await http.get('/getAllUsers')
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async deleteUsers(dataManyIds) {
    try {
      return await http.delete(`/deleteUsers`, { data: dataManyIds })
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async getDetailUser(idDetailUser) {
    try {
      return await http.get(`/getDetailUser/${idDetailUser}`)
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  }
  //   async getOrderDetail(idOrderDetail) {
  //     try {
  //       return await http.get(`/getDetailOrder/${idOrderDetail}`)
  //     } catch (error) {
  //       toast.error(error.response.data.message, {
  //         position: 'top-center',
  //         autoClose: 3000
  //       })
  //       throw error
  //     }
  //   },

  //   async updateOrders(idPutOrder) {
  //     try {
  //       return await http.put(`/updateOrder/${idPutOrder}`)
  //     } catch (error) {
  //       toast.error(error.response.data.message, {
  //         position: 'top-center',
  //         autoClose: 3000
  //       })
  //       throw error
  //     }
  //   },
  //   async updateDelivery(idPutDelivery) {
  //     try {
  //       return await http.put(`/updateDelivery/${idPutDelivery}`)
  //     } catch (error) {
  //       toast.error(error.response.data.message, {
  //         position: 'top-center',
  //         autoClose: 3000
  //       })
  //       throw error
  //     }
  //   },
  //   async cancelOrder(body) {
  //     try {
  //       return await http.put(`/cancelOrder`, body)
  //     } catch (error) {
  //       toast.error(error.response.data.message, {
  //         position: 'top-center',
  //         autoClose: 3000
  //       })
  //       throw error
  //     }
  //   }
}

export default UserAPI
