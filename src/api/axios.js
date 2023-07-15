import axios from "axios";

const myAxios = axios.create({
    baseURL: 'https://api.sivobor.serbin.co/api'
})

myAxios.interceptors.request.use(function (config){
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
    return config
})

export default myAxios