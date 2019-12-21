import Swal from 'sweetalert2'

function catchAxios(err)
{
    Swal.fire('Error', err.response, 'error')
}

function callError(res)
{
    Swal.fire('Oops...', res.data, 'warning')
}

export {
    catchAxios,
    callError
}