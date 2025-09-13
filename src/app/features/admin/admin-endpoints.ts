export const API_ENDPOINTS = {
  RECEPTIONIST: {
    FETCH: '/receptionists',
    SEARCH: '/receptionists',
    GET: '/receptionists',
    CREATE: '/receptionists',
    UPDATE: '/receptionists',
    DELETE: '/receptionists',
  },
  DOCTOR: {
    FETCH: '/doctors',
    SEARCH: '/doctors/filter',
    GET: '/doctors',
    CREATE: '/doctors',
    UPDATE: '/doctors',
    DELETE: '/doctors',

  },
  PATIENT: {
    FETCH: '/patients/paginated',
    SEARCH: '/patients/filter',
    GET: '/patients',
    CREATE: '/patients',
    UPDATE: '/patients',
    DELETE: '/patients',

  }
}