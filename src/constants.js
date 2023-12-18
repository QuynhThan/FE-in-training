// export const BASE_URL =
//   process.env.NODE_ENV === 'develeopment' ? 'http://localhost:5000' : '';
export const BASE_URL = ''; // If using proxy
export const LOCALHOST = 'http://localhost:8080/in-training';
export const VERSION = '/v1';
export const ADMIN = '/admin';
export const USER = '/user';
export const ROOT_ADMIN = LOCALHOST + VERSION + ADMIN;
export const ROOT_USER = LOCALHOST + VERSION + USER;

// subject URL
export const SUBJECTS_URL = ROOT_ADMIN + '/subject-maintenance';
export const SUBJECTS_RETRIEVE = SUBJECTS_URL + '/retrieve';



// LECTURER URL
export const LECTURERS_URL = ROOT_ADMIN + '/lecturers-maintenance';


// Classrooom URL
export const CLASSROOM_URL = ROOT_ADMIN + '/classroom-maintenance';

// Class Credit URL
export const CLASS_CREDIT_URL = ROOT_ADMIN + '/class-credit-maintenance';


// TimeTable
export const TIMETABLE_SUBMIT = ROOT_ADMIN + '/timetable';

// student class
export const STUDENT_CLASS = ROOT_ADMIN + '/student-class';

// faculty
export const FACULTY = ROOT_ADMIN + '/faculty-maintenance';

// semester
export const SEMESTER_URL = ROOT_ADMIN + '/semester';

// common

export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';
