require('dotenv').config()
const axios = require('axios')

const axiosIns = axios.create({
  baseURL: process.env.SERVER_URL || 'http://localhost:40000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  data: null,
})

const fetchAllTokenList = () => {
  return axiosIns.get('prices').then(res => res.data)
}

const fetchHistoryWithToken = token => {
  return axiosIns.get(`history/${token}`).then(res => res.data)
}

const fetchTokenDetail = (token, timestamp) => {
  return axiosIns.get(`prices/${token}/${timestamp}`).then(res => res.data)
}

module.exports = {
  fetchAllTokenList,
  fetchHistoryWithToken,
  fetchTokenDetail,
}
