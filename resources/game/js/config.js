import axios from 'axios';
import moment from 'moment-timezone'

axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN' : document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}
axios.defaults.baseURL = '/api/';

moment.tz.setDefault('America/Guayaquil')