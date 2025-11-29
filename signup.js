import bcrypt from 'bcryptjs';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const { full_name, email, password, role } = req.body;

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const password_hash = bcrypt.hashSync(password, salt);

  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name, email, password_hash, role }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'User created successfully', data });
}
