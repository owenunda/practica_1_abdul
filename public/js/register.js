document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const termsInput = document.getElementById('terms');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validaciones frontend
    if (!name || !email || !password || !confirmPassword) {
      alert('completa los campos');
      return;
    }

    if (password !== confirmPassword) {
      alert('las contraseñas no coinciden');
      return;
    }

    if (!termsInput.checked) {
      alert('debes aceptar los términos y condiciones');
      return;
    }

    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrando...';

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();

      if (result.success) {
        alert('ahora puedes iniciar sesión.');
        window.location.href = '/login';
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error: - register.js:55', error);
      alert('error, intentalo de nuevo');
    } finally {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Crear cuenta';
    }
  });
});
