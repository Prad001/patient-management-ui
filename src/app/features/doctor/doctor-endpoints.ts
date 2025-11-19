export const API_ENDPOINTS = {
  SCHEDULE: {
    FETCH: '/schedule',
    SEARCH: '/schedule',
    GET: '/schedule',
    CREATE: '/schedule',
    UPDATE: '/schedule',
    DELETE: '/schedule',
  },
  AVAILABILITY: {
    CREATE: '/availabilities',
    FETCH: '/availabilities',
    GET: '/availabilities',
    UPDATE: '/availabilities',
  },
  APPOINTMENT: {
    FETCH: '/appointments',
    SEARCH: '/appointments',
    CREATE: '/appointments',
    UPDATE: '/appointments',
    DELETE: '/appointments',
    FETCHBYDOCTOR: '/appointments/doctor',
  },
  PATIENT: {
    FETCH: '/patients/paginated',
    SEARCH: '/patients/filter',
    GET: '/patients',
    FETCHBYDOCTOR: '/patients/doctor',
    DELETE: '/patients',
  },
  SLOT: {
    FETCH: '/slots/paginated',
    SEARCH: '/slots/paginated',
    GET: '/slots',
    CREATE: '/slots',
    UPDATE: '/slots',
    DELETE: '/slots',
    GETALL: '/slots',
  },
  DOCTOR: {
    FETCH: '/doctors/all',
  },
}