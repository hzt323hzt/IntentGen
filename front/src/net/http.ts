import axios, {AxiosRequestHeaders} from "axios";
import { createBrowserHistory } from "history";

let access_token:string = ""
axios.defaults.withCredentials = true;
interface ReqParam{

}
interface ReqBody{

}

const history = createBrowserHistory();
const baseUrl = 'http://localhost:8000/api'
const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "127.0.0.1:*/*"
    }
});

const axiosTempInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "127.0.0.1:*"
    }
});
let inTokenQuery = false

export const fetchAccessToken = async () => {
    inTokenQuery = true;
    try {
        const response = await axiosTempInstance.post('/token');
        access_token = response.data.token
        inTokenQuery = false
        return access_token;  // Adjust according to the response structure
    } catch (error) {
        console.error('Error fetching token:', error);
        inTokenQuery = false
        // throw error;  // Rethrow the error for handling in calling code
    }
};
const addAuthor = ()=>{
    axiosInstance.interceptors.request.use(
        function (config) {
            const token = access_token
            config.headers['Authorization'] = `Bearer ${token}`;
            return config
        },
        function (error) {
            return Promise.reject(error)
        }
    )
}

function toQueryString(param: any = {}): string {
    let paramStr: string = ''
    for (let key in param) {
        paramStr += key + '=' + encodeURIComponent(param[key]) + '&'
    }
    if (paramStr) {
        paramStr = '?' + paramStr.substring(0, paramStr.length - 1)
    }
    return paramStr
}


export function get(url: string, param: ReqParam = {}) {
    addAuthor();
    return axiosInstance.get(url + toQueryString(param))
}

function post(url: string, param: ReqParam = {}, data: ReqBody = {}) {
    addAuthor();
    return axiosInstance.post(url + toQueryString(param), data)
}

function put(url: string, param: ReqParam = {}, data: ReqBody = {}) {
    addAuthor();
    return axiosInstance.put(url + toQueryString(param), data)
}

function del(url: string, param: ReqParam = {}, data: ReqBody = {}) {
    addAuthor();
    return axiosInstance.delete(url + toQueryString(param), {data})
}