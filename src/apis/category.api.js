import http from '../pages/Utils/http'
const CategoryAPI = {
  async getAllCategories() {
    try {
      return await http.get('categories')
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async createCategory(body) {
    try {
      return await http.post('category', body)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async deleteCategory(CategoryId) {
    try {
      return await http.delete(`category/${CategoryId}`)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async updateCategory(body) {
    try {
      return await http.put(`category/${body.id}`, { name: body.name })
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }
}

export default CategoryAPI
