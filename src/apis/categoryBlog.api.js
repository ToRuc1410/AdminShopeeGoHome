import http from '../pages/Utils/http'
const CategoryBlogAPI = {
  async getAllCategoriesBlog() {
    try {
      return await http.get('categoriesBlog')
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async createCategoryBlog(body) {
    try {
      return await http.post('categoryBlog', body)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async deleteCategoryBlog(CategoryId) {
    try {
      return await http.delete(`categoryBlog/${CategoryId}`)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async updateCategoryBlog(body) {
    try {
      return await http.put(`categoryBlog`, body)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }
}

export default CategoryBlogAPI
