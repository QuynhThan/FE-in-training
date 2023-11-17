// export const BASE_URL =
//   process.env.NODE_ENV === 'develeopment' ? 'http://localhost:5000' : '';
export const BASE_URL = ''; // If using proxy
export const LOCALHOST = 'http://localhost:8080/in-training';
export const VERSION = '/v1';
export const ADMIN = '/admin';
export const ROOT_ADMIN = LOCALHOST + VERSION + ADMIN;

// subject URL
export const SUBJECTS_URL = ROOT_ADMIN + '/subject-maintenance';
export const SUBJECTS_RETRIEVE = SUBJECTS_URL + '/retrieve';





export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';
