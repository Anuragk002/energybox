import axios from 'axios';
// import Auth from './Auth';
// import { toast } from 'react-toastify';


const instance = axios.create({ baseURL: 'https://energybox.tech/api' });

export function setupInterceptors() {

    instance.interceptors.request.use(function (config) {
        // const token = Auth.getAccessToken();
        // config.headers.Authorization = token ? `Bearer ${token}` : '';

        // if (token) {
        //     config.headers['Authorization'] = 'Bearer ' + token;
        // }
        // config.headers['Content-Type'] = 'application/json';


        return config
    }, function (error) {
        return Promise.reject(error);
    });



    instance.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (error.response.status === 401 || error.response.data === 'Token Expire') {

            //const navigate = useNavigate()
            // Auth.logout(() => { navigate('/login') })
            // toast.warn("You are now logged out.", { icon: true, hideProgressBar: true, position: toast.POSITION.TOP_CENTER })

            // setTimeout(() => {
            //     Auth.logout(() => { window.location.href = "/login"; })

            // }, 1000);

        }
        return Promise.reject(error);
    })
}

export default instance;
