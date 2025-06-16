const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const roleMap = {
  1: 'superadmin',
  2: 'admin',
  3: 'employee',
};

exports.getuseraccount = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM user_account');
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Database query failed', error: err });
  }
};

// New: Login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password are required' });

  try {
    // join ตาราง user_account กับ employee ตาม employee_id
    const [rows] = await pool.query(`
      SELECT ua.*, e.first_name, e.last_name, e.nickname, e.email_person
      FROM user_account ua
      LEFT JOIN employee e ON ua.employee_id = e.employee_id
      WHERE ua.username = ?
    `, [username]);

    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });
    if (user.is_active !== 1) return res.status(403).json({ message: 'Account inactive' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const payload = {
      id: user.id,
      username: user.username,
      role: roleMap[user.role_id] || 'employee',
      employee_id: user.employee_id,
      first_name: user.first_name,
      last_name: user.last_name,
      nickname: user.nickname,
      email_person: user.email_person,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ 
      token,
      role: payload.role,
      employee: {
        employee_id: user.employee_id,
        first_name: user.first_name,
        last_name: user.last_name,
        nickname: user.nickname,
        email_person: user.email_person,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
