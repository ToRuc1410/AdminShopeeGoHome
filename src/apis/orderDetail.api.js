import { toast } from 'react-toastify'
import http from '../pages/Utils/http'

const OrderDetailAPI = {
  async getAllDetail(dataFilter) {
    try {
      return await http.get('/getAllDetails', { params: dataFilter })
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async getOrderDetail(idOrderDetail) {
    try {
      return await http.get(`/getDetailOrder/${idOrderDetail}`)
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async deleteOrders(dataManyIds) {
    try {
      return await http.delete(`/listOrder`, { data: dataManyIds })
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async updateOrders(idPutOrder) {
    try {
      return await http.put(`/updateOrder/${idPutOrder}`)
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async updateDelivery(idPutDelivery) {
    try {
      return await http.put(`/updateDelivery/${idPutDelivery}`)
    } catch (error) {
      // toast.error(error.response.data.message, {
      //   position: 'top-center',
      //   autoClose: 3000
      // })
      console.log(error.response.data.message)
      throw error
    }
  },
  async updateDone(idPutDone) {
    try {
      return await http.put(`/updateDone/${idPutDone}`)
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async cancelOrder(body) {
    try {
      return await http.put(`/cancelOrder`, body)
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  /// Review Order
  async getAllReviewOrder() {
    try {
      return await http.get(`/getAllReviewOrder`)
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async deleteReviewOrder(dataManyIds) {
    try {
      return await http.delete(`/listReviewOrder`, { data: dataManyIds })
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  }
}

export default OrderDetailAPI
