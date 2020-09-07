const axios = require('axios')

const axiosIns = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  data: null,
})

const fetchAllTokenList = () => {
  return axiosIns.get('prices').then(res => res.data)
}

const fetchHistoryWithToken = (source, token) => {
  return axiosIns.get(`history/${source}/${token}`).then(res => res.data)
}

const fetchTokenDetail = (source, token, timestamp) => {
  return axiosIns.get(`prices/${source}/${token}/${timestamp}`).then(res => res.data)
}

module.exports = {
  fetchAllTokenList,
  fetchHistoryWithToken,
  fetchTokenDetail,
}
