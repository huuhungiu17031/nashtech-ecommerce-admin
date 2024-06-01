import Swal from 'sweetalert2';
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});
export const notificationSuccess = (title = 'Signed in successfully') => {
    return Toast.fire({
        icon: 'success',
        title,
    });
};

export const notificationError = (title = 'No permission') => {
    return Toast.fire({
        icon: 'error',
        title,
    });
};
