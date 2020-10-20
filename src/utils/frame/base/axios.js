import Axios from 'axios'

const baseURL = 'http://localhost:9991'
// const baseURL = process.env.MOCK_API // api的base_url

// response拦截器
Axios.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})

const request = function(params) {
  return Axios({
    url: params.url,
    method: params.method,
    baseURL: baseURL,
    params: {},
    data: {}
  }).catch(err => {
    console.log(err)
  })
}
export default request
