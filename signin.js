import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient';

export default async function handler(req, res) {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return res.status(400).json({ error: 'Invalid email or password' });

  const isMatch = bcrypt.compareSync(password, data.password_hash);
  if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

  res.status(200).json({ message: 'Login successful', user: data });
}
