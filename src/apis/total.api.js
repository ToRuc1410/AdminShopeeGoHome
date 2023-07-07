import http from '../pages/Utils/http'
const totalAll = {
  async gettotalAll() {
    try {
      return await http.get('/getAllTotal')
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }
}

export default totalAll
