const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nexora_defense_resilience_secret_key_2026';

const DEMO_USERS = [
  { id: 'usr-1', email: 'commander@nexora.mil', password: 'password123', name: 'Cmdr. Ellen Vance', role: 'COMMANDER', department: 'Fleet Readiness Command' },
  { id: 'usr-2', email: 'manager@nexora.mil', password: 'password123', name: 'Logistics Lead Marcus Vance', role: 'LOGISTICS LEAD', department: 'Global Supply Chain Directorate' },
  { id: 'usr-3', email: 'analyst@nexora.mil', password: 'password123', name: 'Dr. Sarah Chen', role: 'AI ANALYST', department: 'Predictive Intelligence Lab' },
  { id: 'usr-4', email: 'viewer@nexora.mil', password: 'password123', name: 'Guest Inspector', role: 'GUEST INSPECTOR', department: 'Public Oversight Board' }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = DEMO_USERS.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid NEXORA defense credentials. Please check email/password or use Demo Login.'
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Authentication successful. Access granted to NEXORA Command Center.',
    token,
    user: userWithoutPassword
  });
});

router.get('/me', (req, res) => {
  res.json({ success: true, authenticated: true, user: DEMO_USERS[0] });
});

module.exports = router;
