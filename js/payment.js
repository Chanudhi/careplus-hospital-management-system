document.addEventListener('DOMContentLoaded', () => {
  const cardTab = document.getElementById('cardTabBtn');
  const paypalTab = document.getElementById('paypalTabBtn');
  const cardForm = document.getElementById('cardFormSection');
  const paypalForm = document.getElementById('paypalFormSection');
  const paymentMethodInput = document.getElementById('paymentMethod');

  const outstandingDisplay = document.getElementById('outstandingAmount');
  const payBtn = document.getElementById('payBtn');
  const cardFormEl = document.getElementById('paymentForm');

  // Input Fields
  const cardNumberInput = document.getElementById('cardNumber');
  const cardExpiryInput = document.getElementById('cardExpiry');
  const cardCvvInput = document.getElementById('cardCvv');
  const cardNameInput = document.getElementById('cardName');
  const paypalEmailInput = document.getElementById('paypalEmail');

  // Load outstanding payment
  let outstandingPayment = parseFloat(localStorage.getItem('hms_outstanding_payment') || '4500');
  if (outstandingDisplay) {
    outstandingDisplay.textContent = `Rs. ${outstandingPayment.toLocaleString()}`;
  }

  if (outstandingPayment === 0 && payBtn) {
    payBtn.disabled = true;
    payBtn.textContent = 'Paid';
    if (outstandingDisplay) outstandingDisplay.textContent = 'Rs. 0 (No outstanding dues)';
  }

  // Tab switching
  if (cardTab && paypalTab && cardForm && paypalForm && paymentMethodInput) {
    cardTab.addEventListener('click', () => {
      cardTab.classList.add('active');
      paypalTab.classList.remove('active');
      cardForm.style.display = 'block';
      paypalForm.style.display = 'none';
      paymentMethodInput.value = 'card';
    });

    paypalTab.addEventListener('click', () => {
      paypalTab.classList.add('active');
      cardTab.classList.remove('active');
      cardForm.style.display = 'none';
      paypalForm.style.display = 'block';
      paymentMethodInput.value = 'paypal';
    });
  }

  // Format Card Number (space every 4 digits)
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formatted = '';
      for (let i = 0; i < value.length && i < 16; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += value[i];
      }
      e.target.value = formatted;
    });
  }

  // Format Expiry Date (MM/YY)
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (value.length > 2) {
        e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4);
      } else {
        e.target.value = value;
      }
    });
  }

  // Format CVV (3 digits)
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').slice(0, 3);
    });
  }

  // Toast notifier helper
  function showToast(message, type = 'info') {
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
    
    toast.innerHTML = `
      <i class="bi ${iconClass}" style="font-size: 1.25rem;"></i>
      <div style="flex-grow: 1;">
        <span style="font-weight: 600; display: block;">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${message}</span>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Payment Submit Form
  if (cardFormEl) {
    cardFormEl.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const method = paymentMethodInput.value;

      if (method === 'card') {
        const cNum = cardNumberInput.value.replace(/\s+/g, '');
        const cExp = cardExpiryInput.value;
        const cCvv = cardCvvInput.value;
        const cName = cardNameInput.value.trim();

        // Clear previous state
        const fields = [cardNumberInput, cardExpiryInput, cardCvvInput, cardNameInput];
        fields.forEach(f => f.classList.remove('input-invalid'));

        if (cNum.length !== 16) {
          cardNumberInput.classList.add('input-invalid');
          isValid = false;
        }

        if (!/^\d{2}\/\d{2}$/.test(cExp)) {
          cardExpiryInput.classList.add('input-invalid');
          isValid = false;
        } else {
          // validate expiry date logic
          const parts = cExp.split('/');
          const mm = parseInt(parts[0], 10);
          const yy = parseInt(parts[1], 10);
          if (mm < 1 || mm > 12) {
            cardExpiryInput.classList.add('input-invalid');
            isValid = false;
          }
        }

        if (cCvv.length !== 3) {
          cardCvvInput.classList.add('input-invalid');
          isValid = false;
        }

        if (!cName) {
          cardNameInput.classList.add('input-invalid');
          isValid = false;
        }
      } else {
        // PayPal
        const pEmail = paypalEmailInput.value.trim();
        paypalEmailInput.classList.remove('input-invalid');
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(pEmail)) {
          paypalEmailInput.classList.add('input-invalid');
          isValid = false;
        }
      }

      if (!isValid) {
        showToast('Please correct validation warnings before proceeding.', 'danger');
        return;
      }

      // Show loader
      const loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('active');

      setTimeout(() => {
        // Clear loader
        if (loader) loader.classList.remove('active');

        // Success Popup Show
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        // Update outstanding balance to 0 in local storage
        localStorage.setItem('hms_outstanding_payment', '0');

        // Add payment success notification
        const notifications = JSON.parse(localStorage.getItem('hms_notifications')) || [];
        notifications.unshift({
          id: Date.now(),
          text: `Payment of Rs. ${outstandingPayment} Completed Successfully`,
          time: 'Just now'
        });
        localStorage.setItem('hms_notifications', JSON.stringify(notifications));

        // When closing the modal or after a timer, redirect
        document.getElementById('successModalClose').addEventListener('click', () => {
          window.location.href = 'patient-dashboard.html';
        });

        setTimeout(() => {
          window.location.href = 'patient-dashboard.html';
        }, 3000);

      }, 1500);
    });
  }
});
