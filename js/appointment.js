document.addEventListener('DOMContentLoaded', () => {
  // Cascading dropdown maps
  const departmentDoctors = {
    'Cardiology': ['Dr. Silva', 'Dr. Roberts'],
    'Neurology': ['Dr. Watson', 'Dr. Jenkins'],
    'Pediatrics': ['Dr. Foster', 'Dr. Adams'],
    'Orthopedics': ['Dr. Patel', 'Dr. Stone']
  };

  const deptSelect = document.getElementById('department');
  const docSelect = document.getElementById('doctor');
  const dateInput = document.getElementById('appointmentDate');
  const timeSelect = document.getElementById('appointmentTime');
  const reasonInput = document.getElementById('reason');
  const notesInput = document.getElementById('notes');
  const bookForm = document.getElementById('bookingForm');

  // Load doctors dynamically based on department
  if (deptSelect && docSelect) {
    deptSelect.addEventListener('change', () => {
      const selectedDept = deptSelect.value;
      docSelect.innerHTML = '<option value="">-- Select Doctor --</option>';
      
      if (selectedDept && departmentDoctors[selectedDept]) {
        departmentDoctors[selectedDept].forEach(doctor => {
          const opt = document.createElement('option');
          opt.value = doctor;
          opt.textContent = doctor;
          docSelect.appendChild(opt);
        });
        docSelect.disabled = false;
      } else {
        docSelect.disabled = true;
      }
    });
  }

  // Dynamic Step Highlighting based on user progression
  const stepItems = document.querySelectorAll('nav[aria-label="Booking steps"] ol li');
  
  function updateStepsProgress() {
    if (!stepItems.length) return;
    
    // Step 1: Select Specialist (Department & Doctor)
    const step1Done = deptSelect.value && docSelect.value;
    // Step 2: Date & Time
    const step2Done = dateInput.value && timeSelect.value;
    
    if (step1Done && step2Done) {
      // Highlighting Step 3
      setStepActive(2);
    } else if (step1Done) {
      // Highlighting Step 2
      setStepActive(1);
    } else {
      // Highlighting Step 1
      setStepActive(0);
    }
  }

  function setStepActive(activeIndex) {
    stepItems.forEach((li, idx) => {
      const badge = li.querySelector('.badge');
      const label = li.querySelector('strong, span:not(.badge)');
      
      if (idx === activeIndex) {
        li.className = "d-flex align-items-center gap-2";
        if (badge) {
          badge.className = "badge bg-primary rounded-circle d-inline-flex align-items-center justify-content-center";
        }
        if (label) {
          label.className = "text-primary fw-bold";
          // Replace span with strong tag if it's text for screen readers
          if (label.tagName === 'SPAN') {
            const strong = document.createElement('strong');
            strong.className = "text-primary";
            strong.textContent = label.textContent;
            label.replaceWith(strong);
          }
        }
      } else if (idx < activeIndex) {
        // Completed step
        li.className = "d-flex align-items-center gap-2 text-success";
        if (badge) {
          badge.className = "badge bg-success rounded-circle d-inline-flex align-items-center justify-content-center";
          badge.innerHTML = '<i class="bi bi-check-lg" aria-hidden="true"></i>';
        }
        if (label) label.className = "text-success fw-medium";
      } else {
        // Pending step
        li.className = "d-flex align-items-center gap-2 text-muted";
        if (badge) {
          badge.className = "badge bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center";
          badge.textContent = (idx + 1).toString();
        }
        if (label) label.className = "text-muted";
      }
    });
  }

  // Bind change listeners to trigger progression checks
  [deptSelect, docSelect, dateInput, timeSelect].forEach(element => {
    if (element) {
      element.addEventListener('change', updateStepsProgress);
    }
  });

  // Prevent selecting past dates in date picker
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Toast message function
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
    if (type === 'warning') iconClass = 'bi-exclamation-circle-fill';

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
    }, 4500);
  }

  if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear validation marks and reset aria-invalid states
      const inputs = [deptSelect, docSelect, dateInput, timeSelect, reasonInput];
      inputs.forEach(input => {
        if (input) {
          input.classList.remove('input-invalid');
          input.setAttribute('aria-invalid', 'false');
        }
      });

      let isValid = true;
      let firstInvalidInput = null;

      // Validate inputs
      if (!deptSelect.value) {
        deptSelect.classList.add('input-invalid');
        deptSelect.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = deptSelect;
      }

      if (!docSelect.value) {
        docSelect.classList.add('input-invalid');
        docSelect.setAttribute('aria-invalid', 'true');
        const errSpan = document.getElementById('doctorError');
        if (errSpan) {
          errSpan.textContent = 'Please select a doctor.';
        }
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = docSelect;
      }

      if (!dateInput.value) {
        dateInput.classList.add('input-invalid');
        dateInput.setAttribute('aria-invalid', 'true');
        const errSpan = document.getElementById('dateError');
        if (errSpan) {
          errSpan.textContent = 'Please select an appointment date.';
        }
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = dateInput;
      } else {
        const selectedDate = new Date(dateInput.value);
        const todayStr = new Date().toISOString().split('T')[0];
        const today = new Date(todayStr);
        
        if (selectedDate < today) {
          dateInput.classList.add('input-invalid');
          dateInput.setAttribute('aria-invalid', 'true');
          const errSpan = document.getElementById('dateError');
          if (errSpan) {
            errSpan.textContent = 'Appointment date cannot be in the past.';
          }
          isValid = false;
          if (!firstInvalidInput) firstInvalidInput = dateInput;
        }
      }

      if (!timeSelect.value) {
        timeSelect.classList.add('input-invalid');
        timeSelect.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = timeSelect;
      }

      if (!reasonInput.value.trim()) {
        reasonInput.classList.add('input-invalid');
        reasonInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = reasonInput;
      }

      if (!isValid) {
        showToast('Please correct validation warnings before booking.', 'danger');
        // ACCESSIBILITY: Shift keyboard focus to the first invalid field so screen readers announce the issue
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // Show loader
      const loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('active');

      setTimeout(() => {
        // Save appointment to localStorage
        const appointments = JSON.parse(localStorage.getItem('hms_appointments')) || [];
        const newApp = {
          id: Date.now(),
          department: deptSelect.value,
          doctor: docSelect.value,
          date: dateInput.value,
          time: timeSelect.options[timeSelect.selectedIndex].text,
          reason: reasonInput.value.trim(),
          notes: notesInput ? notesInput.value.trim() : '',
          status: 'Approved'
        };
        
        appointments.unshift(newApp);
        localStorage.setItem('hms_appointments', JSON.stringify(appointments));

        // Add a notification
        const notifications = JSON.parse(localStorage.getItem('hms_notifications')) || [];
        notifications.unshift({
          id: Date.now(),
          text: `Appointment booked with ${newApp.doctor} for ${newApp.date}`,
          time: 'Just now'
        });
        localStorage.setItem('hms_notifications', JSON.stringify(notifications));

        if (loader) loader.classList.remove('active');

        showToast('Appointment booked successfully!', 'success');

        // Redirect to Patient Dashboard
        setTimeout(() => {
          window.location.href = 'patient-dashboard.html';
        }, 1500);

      }, 1000);
    });
  }
});
