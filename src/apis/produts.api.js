import { toast } from 'react-toastify'
import http from '../pages/Utils/http'
const ProductAPI = {
  async getAllProducts() {
    try {
      return await http.get('/products')
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async getDetailProduct(idProduct) {
    try {
      return await http.get(`/products/${idProduct}`)
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async createProduct(body) {
    try {
      return await http.post('product', body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async deleteProduct(productId) {
    try {
      return await http.delete(`product/${productId}`)
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  },
  async updateProduct(productId, body) {
    try {
      return await http.put(`products/${productId}`, body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-center',
        autoClose: 3000
      })
      throw error
    }
  }
}

export default ProductAPI
