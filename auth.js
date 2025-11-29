import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// SIGN UP
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const role = document.getElementById('role').value.toLowerCase();
  const password = document.getElementById('password').value;

  // Insert into database
  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name: name, email, password_hash: password, role }]);

  if (error) {
    alert('Error signing up: ' + error.message);
  } else {
    alert('Account created successfully! You can now sign in.');
    window.location.href = 'signin.html';
  }
});

// SIGN IN
document.getElementById('signinForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  // Find user
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    alert('Invalid email or password');
    return;
  }

  // ⚠️ TODO: Use password hashing in production
  if (data.password_hash !== password) {
    alert('Invalid password');
  } else {
    alert(`Welcome back, ${data.full_name}!`);
    // Redirect based on role
    if (data.role === 'admin') window.location.href = '/admin-dashboard.html';
    else if (data.role === 'teacher') window.location.href = '/teacher-dashboard.html';
    else window.location.href = '/student-dashboard.html';
  }
});

if (data.password_hash === password) {
  // Save session info
  localStorage.setItem('dzidzoUser', JSON.stringify({
    id: data.id,
    name: data.full_name,
    email: data.email,
    role: data.role
  }));

  alert(`Welcome back, ${data.full_name}!`);

  // Redirect based on role
  if (data.role === 'admin') window.location.href = '/admin-dashboard.html';
  else if (data.role === 'teacher') window.location.href = '/teacher-dashboard.html';
  else window.location.href = '/student-dashboard.html';
}
