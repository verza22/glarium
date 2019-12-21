import axios from 'axios';
import router from 'Js/router.js'
axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN' : document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}
axios.defaults.baseURL = '/api/';
