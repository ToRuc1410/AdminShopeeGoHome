import http from '../pages/Utils/http'
const totalAll = {
  async gettotalAll() {
    try {
      return await http.get('/getAllTotal')
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async dataMapMonth() {
    try {
      return await http.get('/dataMapMonth')
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  async getDataDate(body) {
    try {
      return await http.post('/dataDate', body)
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }
}
export default totalAll
