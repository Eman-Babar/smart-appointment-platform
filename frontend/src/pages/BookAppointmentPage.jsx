import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import { appointmentService, serviceService } from '../services/appointmentService';

const timeSlots = [
  { label: 'Morning',   slots: ['09:00','09:30','10:00','10:30','11:00','11:30'] },
  { label: 'Afternoon', slots: ['12:00','12:30','14:00','14:30','15:00','15:30'] },
  { label: 'Evening',   slots: ['16:00','16:30','17:00'] },
];

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    service_id: '', appointment_date: '', appointment_time: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    serviceService.getAll().then(res => setServices(res.data.services || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await appointmentService.book(form);
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const selectedService = services.find(s => s.id === form.service_id);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-sm text-gray-500 mt-1">Select a service and your preferred time slot</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm p-3.5 rounded-xl mb-5">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Service Selection */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Service</h2>
            <div className="grid grid-cols-1 gap-2">
              {services.map(s => (
                <label
                  key={s.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    form.service_id === s.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="service"
                      value={s.id}
                      checked={form.service_id === s.id}
                      onChange={e => setForm({ ...form, service_id: e.target.value })}
                      className="text-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.duration_minutes} minutes</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">Rs. {s.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Date</h2>
            <input
              type="date"
              min={today}
              value={form.appointment_date}
              onChange={e => setForm({ ...form, appointment_date: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              required
            />
          </div>

          {/* Time Slot Selection */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Select Time Slot</h2>
            <div className="space-y-4">
              {timeSlots.map(({ label, slots }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setForm({ ...form, appointment_time: slot })}
                        className={`py-2.5 text-sm rounded-xl border font-medium transition-all ${
                          form.appointment_time === slot
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                            : 'border-gray-100 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Additional Notes <span className="text-gray-400 font-normal">(optional)</span></h2>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 resize-none"
              placeholder="Any special requirements or information..."
            />
          </div>

          {/* Summary + Submit */}
          {form.service_id && form.appointment_date && form.appointment_time && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">Booking Summary</p>
              <div className="space-y-1 text-sm text-indigo-800">
                <p>Service: <span className="font-medium">{selectedService?.name}</span></p>
                <p>Date: <span className="font-medium">{new Date(form.appointment_date).toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
                <p>Time: <span className="font-medium">{form.appointment_time}</span></p>
                <p>Price: <span className="font-medium">Rs. {selectedService?.price}</span></p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !form.service_id || !form.appointment_date || !form.appointment_time}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Confirming booking...
              </span>
            ) : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </Layout>
  );
}