import http from '../pages/Utils/http'
const blogsAPI = {
  async getAllBlogs(idBlog) {
    try {
      return await http.get(`blogs/${idBlog}`)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async getBlog(idBlog) {
    try {
      return await http.get(`blog/${idBlog}`)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async createBlog(body) {
    try {
      return await http.post('blog', body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async updateBlog(body) {
    try {
      return await http.put(`updateBlog`, body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async updateBlogs(body) {
    try {
      return await http.put(`updateBlogs`, body)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async deleteBlog(idBlog) {
    try {
      return await http.delete(`blogs/${idBlog}`)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }
}

export default blogsAPI
