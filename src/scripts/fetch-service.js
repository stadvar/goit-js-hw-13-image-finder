const axios = require('axios').default;
const API_KEY = '18927781-76591304de9a35a1d49e108a5';
const BASE_URL = 'https://pixabay.com/api';

export default class FetchService {
  constructor() {
    this.searchQuery = '';
    this.pageNumber = 1;
    this.currentCount = 0;
  }
  async fetchData() {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          image_type: 'photo',
          orientation: 'horizontal',
          q: this.searchQuery,
          page: this.pageNumber,
          per_page: 12,
          key: API_KEY,
        },
      });
      const { hits, totalHits } = response.data;
      return { hits, totalHits };
    } catch (error) {
      throw error;
    }
  }

  incrementPage() {
    this.pageNumber += 1;
  }
  async nextDataDozen() {
    this.pageNumber += 1;
    this.currentCount = this.pageNumber * 12;
    return this.fetchData();
  }
}
