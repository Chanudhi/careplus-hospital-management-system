# CarePlus - Hospital Management System

CarePlus is a premium, fully-functional, and responsive **Hospital Management System** designed for medical clinics and healthcare facilities. It provides a cohesive user experience with dedicated Patient and Administrator dashboards, appointment scheduling, billing panels, and electronic health record access.

Developed with a strong emphasis on **aesthetic design**, **responsive layouts**, and **WCAG AA accessibility guidelines**, this application showcases a modern healthcare portal.

---

## 🎨 Design & Theme System
CarePlus features a fully custom **Light / Dark Mode theme system** utilizing CSS variables.
- **Primary Color**: `#0066CC` (Vibrant Hospital Blue)
- **Secondary Color**: `#00A99D` (Teal Accent)
- **Aesthetic Elements**: Smooth scale transitions on hover, subtle container box-shadows, modern Outfit & Inter typography, and linear background gradients.

---

## 📁 Project Structure

```
Hospital-Management-System/
│
├── index.html                 (Login Page with Role Selection)
├── patient-dashboard.html     (Overview, Vitals, Prescriptions, Lab reports)
├── admin-dashboard.html       (Analytics graphs, Registration list, System logs)
├── appointment.html           (Cascading doctor selectors, past-date validation check)
├── medical-records.html       (Ailment files, prescriptions view modals)
├── payment.html               (Outstanding dues panel, Card & PayPal portals)
│
├── css/
│      style.css               (Base variables, theme toggling, custom validation)
│      dashboard.css           (Responsive sidebar layout grid, badge indicators)
│
├── js/
│      login.js                (Credentials validation & LocalStorage session)
│      appointment.js          (Cascading doctor lists, past-date calendar check)
│      payment.js              (Card parameter validators, transaction modals)
│
└── assets/
       logo.png                (Hospital Logo generated via AI)
       doctors/
             dr_silva.png      (Doctor portrait)
```

---

## ⚙️ Core Features & Capabilities

1. **Role-Based Routing (Login)**:
   - Credentials check with simulated feedback validation.
   - Redirects to dashboards based on the chosen role (`Patient` -> Patient Dashboard; `Administrator/Doctor/Nurse` -> Admin Dashboard).
   - *Demo Credentials:*
     - Patient: `patient@hospital.com` | `patient123`
     - Admin: `admin@hospital.com` | `admin123`
2. **Local Storage Synchronization**:
   - Creating an appointment in `appointment.html` automatically records the entry in `localStorage` and displays it in the Patient Dashboard upcoming slot.
   - Outstanding balances (defaulting to `Rs. 4,500`) are synced. Completing a transaction in `payment.html` resets the dues to `0` and removes the warning banner from the dashboard.
   - Active user profile settings (name and email initials) display dynamically.
3. **Analytics Visualization**:
   - Integrates **Chart.js** on the Administrator Dashboard to render responsive bar and doughnut charts representing monthly revenue trends and appointment distribution across clinical departments.
4. **Toast Notifications & Transitions**:
   - Dynamic slide-in success/warning toast feedback alerts on form submissions or download prompts.
   - Blur loaders on page redirection.

---

## ♿ Accessibility Compliance (WCAG AA)
CarePlus integrates the following features for inclusive access:
- **Semantic HTML**: Structural outlines using `<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, and `<footer>`.
- **Keyboard Navigation**: Active outline focus ring indicators (`outline: 3px solid #0066CC;`) visible on all buttons, selectors, links, and forms.
- **Screen Reader Compatibility**: Screen reader helper class tags (`.sr-only`) and explicit input-to-label associations (`label for="id"` matched with `input id="id"`).
- **High Contrast**: Meets WCAG AA requirements in both Light and Dark modes.

---

## 🚀 Running Locally

You can serve this project instantly using any lightweight HTTP server.

### Option 1: Python HTTP Server (Recommended)
1. Open your terminal or shell in this directory.
2. Run the command:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`.

### Option 2: Live Server (VS Code Extension)
1. Right-click `index.html` inside VS Code.
2. Choose **"Open with Live Server"**.
