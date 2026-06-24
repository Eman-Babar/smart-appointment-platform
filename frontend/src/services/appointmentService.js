import API from './api';
export const appointmentService = {
  getAll:      ()       => API.get('/appointments'),
  getMine:     ()       => API.get('/appointments/my'),
  getById:     (id)     => API.get(`/appointments/${id}`),
  book:        (data)   => API.post('/appointments', data),
  cancel:      (id)     => API.put(`/appointments/${id}/cancel`),
  reschedule:  (id, data) => API.put(`/appointments/${id}/reschedule`, data),
  approve:     (id)     => API.put(`/appointments/${id}/approve`),
  reject:      (id)     => API.put(`/appointments/${id}/reject`),
  complete: (id)        => API.put(`/appointments/${id}/complete`),
};

export const serviceService = {
  getAll:   ()     => API.get('/services'),
  getById:  (id)   => API.get(`/services/${id}`),
  create:   (data) => API.post('/services', data),
  update:   (id, data) => API.put(`/services/${id}`, data),
  delete:   (id)   => API.delete(`/services/${id}`),
};

export const recommendationService = {
  get: () => API.get('/recommendations'),
};