document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const roleSelect = document.getElementById('role');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleIcon = document.getElementById('toggleIcon');
  const rememberMeCheckbox = document.getElementById('rememberMe');

  // Load remembered email
  const rememberedEmail = localStorage.getItem('hms_remembered_email');
  if (rememberedEmail && emailInput) {
    emailInput.value = rememberedEmail;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }

  // Password visibility toggle
  if (togglePasswordBtn && passwordInput && toggleIcon) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Toggle eye icon class
      if (type === 'text') {
        toggleIcon.classList.remove('bi-eye');
        toggleIcon.classList.add('bi-eye-slash');
      } else {
        toggleIcon.classList.remove('bi-eye-slash');
        toggleIcon.classList.add('bi-eye');
      }
    });
  }

  // Custom Toast display helper
  window.showToast = function(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'custom-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    
    let iconClass = 'bi-info-circle-fill';
    if (type === 'success') iconClass = 'bi-check-circle-fill';
    if (type === 'danger') iconClass = 'bi-exclamation-triangle-fill';
    if (type === 'warning') iconClass = 'bi-exclamation-circle-fill';

    toast.innerHTML = `
      <i class="bi ${iconClass}" style="font-size: 1.25rem;"></i>
      <div style="flex-grow: 1;">
        <span style="font-weight: 600; display: block;">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${message}</span>
      </div>
    `;

    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // Login handler
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clean previous validations
      const inputs = [emailInput, passwordInput, roleSelect];
      inputs.forEach(input => {
        if (input) input.classList.remove('input-invalid');
      });

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const role = roleSelect.value;

      let isValid = true;

      // Email validation
      if (!email) {
        emailInput.classList.add('input-invalid');
        isValid = false;
      } else if (!validateEmail(email)) {
        emailInput.classList.add('input-invalid');
        const errSpan = emailInput.nextElementSibling;
        if (errSpan && errSpan.classList.contains('validation-error-msg')) {
          errSpan.textContent = 'Please enter a valid email address.';
        }
        isValid = false;
      }

      // Password validation
      if (!password) {
        passwordInput.classList.add('input-invalid');
        isValid = false;
      } else if (password.length < 6) {
        passwordInput.classList.add('input-invalid');
        const errSpan = passwordInput.parentElement.nextElementSibling;
        if (errSpan && errSpan.classList.contains('validation-error-msg')) {
          errSpan.textContent = 'Password must be at least 6 characters.';
        }
        isValid = false;
      }

      // Role validation
      if (!role) {
        roleSelect.classList.add('input-invalid');
        isValid = false;
      }

      if (!isValid) {
        showToast('Please correct the validation errors below.', 'danger');
        return;
      }

      // Show spinner loader
      const loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('active');

      setTimeout(() => {
        // Mock credentials validation
        // Any password matching our format is accepted for demo purposes
        const mockCredentials = {
          'patient': { email: 'patient@hospital.com', name: 'Chanudhi Aluthge' },
          'admin': { email: 'admin@hospital.com', name: 'Admin User' },
          'doctor': { email: 'doctor@hospital.com', name: 'Dr. Silva' },
          'nurse': { email: 'nurse@hospital.com', name: 'Nurse Clara' }
        };

        const expectedEmail = role + '@hospital.com';
        
        // Let's check credentials or allow any password >= 6 chars for simplicity, but prompt details
        // To make it look real, we accept the role-associated emails
        let loggedInUser = { name: 'Demo User', role: role, email: email };
        
        if (mockCredentials[role]) {
          loggedInUser.name = mockCredentials[role].name;
        }

        // Save session details to localStorage
        localStorage.setItem('hms_session_user', JSON.stringify(loggedInUser));

        // Save remember me status
        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
          localStorage.setItem('hms_remembered_email', email);
        } else {
          localStorage.removeItem('hms_remembered_email');
        }

        // Initialize state variables if they don't exist
        initializeMockData();

        if (loader) loader.classList.remove('active');

        // Redirection based on role selection
        if (role === 'patient') {
          window.location.href = 'patient-dashboard.html';
        } else {
          window.location.href = 'admin-dashboard.html';
        }
      }, 1000);
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Initialize initial state mock data in localStorage
  function initializeMockData() {
    // Outstanding payments setup
    if (localStorage.getItem('hms_outstanding_payment') === null) {
      localStorage.setItem('hms_outstanding_payment', '4500');
    }

    // Default appointments list
    if (localStorage.getItem('hms_appointments') === null) {
      const defaultAppointments = [
        {
          id: 1,
          doctor: 'Dr. Silva',
          department: 'Cardiology',
          date: '2026-07-24',
          time: '10:30 AM',
          reason: 'Regular heart check-up',
          status: 'Approved'
        }
      ];
      localStorage.setItem('hms_appointments', JSON.stringify(defaultAppointments));
    }

    // Default notifications list
    if (localStorage.getItem('hms_notifications') === null) {
      const defaultNotifications = [
        { id: 1, text: 'Appointment Approved with Dr. Silva', time: '1 hour ago' },
        { id: 2, text: 'Payment Successful (Invoice #1094)', time: 'Yesterday' },
        { id: 3, text: 'Prescription Updated (Amoxicillin)', time: '2 days ago' }
      ];
      localStorage.setItem('hms_notifications', JSON.stringify(defaultNotifications));
    }
  }

  // Global Theme Setup
  const currentTheme = localStorage.getItem('hms_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    updateThemeToggleUI(themeToggle, currentTheme);
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('hms_theme', theme);
      updateThemeToggleUI(themeToggle, theme);
    });
  }

  function updateThemeToggleUI(btn, theme) {
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');
    if (theme === 'dark') {
      if (icon) {
        icon.className = 'bi bi-sun-fill';
      }
      if (text) text.textContent = 'Light Mode';
    } else {
      if (icon) {
        icon.className = 'bi bi-moon-fill';
      }
      if (text) text.textContent = 'Dark Mode';
    }
  }
});
