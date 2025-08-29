document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const btnLogin = document.getElementById('btn_login');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert('completa todos los campo');
      return;
    }

    try {
      btnLogin.disabled = true;
      btnLogin.textContent = 'Iniciando...';

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        alert('¡Login exitoso!');
        window.currentUser = result.user;
        window.location.href = '/';
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('error: - login.js:40', error);
      alert('error de conexion, intentalo de nuevo');
    } finally {
      btnLogin.disabled = false;
      btnLogin.textContent = 'iniciar Sesión';
    }
  });
});
