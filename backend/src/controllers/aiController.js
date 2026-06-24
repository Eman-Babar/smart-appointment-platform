const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../config/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const [servicesRes, appointmentsRes] = await Promise.all([
      pool.query('SELECT name, duration_minutes, price, category FROM services WHERE is_active = true'),
      pool.query(
        `SELECT a.appointment_date, a.appointment_time, a.status, s.name as service_name
         FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE a.user_id = $1
         ORDER BY a.appointment_date DESC LIMIT 5`,
        [req.user.id]
      ),
    ]);

    const services     = servicesRes.rows;
    const appointments = appointmentsRes.rows;

    const systemPrompt = `You are a helpful appointment assistant for AppointEase platform.

Available services:
${services.map(s => `- ${s.name} (${s.duration_minutes} min, Rs. ${s.price}, category: ${s.category})`).join('\n')}

User's recent appointments:
${appointments.length > 0
  ? appointments.map(a =>
      `- ${a.service_name} on ${new Date(a.appointment_date).toDateString()} at ${a.appointment_time?.slice(0,5)} (${a.status})`
    ).join('\n')
  : 'No appointments yet'
}

Available time slots: 9:00 AM to 5:00 PM, every 30 minutes, Monday to Saturday.

Help the user with:
- Finding available appointment slots
- Recommending services based on their history
- Answering questions about services and pricing
- General appointment guidance

Keep responses concise and friendly.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(message);
    const reply  = result.response.text();

    res.json({ success: true, reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'AI service error' });
  }
};