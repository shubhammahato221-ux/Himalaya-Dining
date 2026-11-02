/**
 * HIMALAYAN HEARTH — AUTHENTICATION & ACCOUNT CONTROLLER
 * Manages Customer Sign In, Registration, Session,
 * Saved Addresses, and Order History.
 */

import { 
  getCurrentUser, 
  setCurrentUser, 
  logoutUser, 
  getOrders, 
  formatNPR 
} from './storage.js';
import { showToast } from './main.js';

// 1. Login Page Controller
export function initLoginPage() {
  const form = document.getElementById('loginForm');
  const demoLoginBtn = document.getElementById('demoLoginBtn');

  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      const demoUser = {
        id: 'user_maya',
        name: 'Maya Shrestha',
        email: 'maya.shrestha@example.com',
        phone: '+977 9801234567',
        role: 'customer',
        address: 'House #14, Gairidhara Marg, Ward 1',
        area: 'Durbar Marg / Lazimpat',
        district: 'Kathmandu'
      };
      setCurrentUser(demoUser);
      showToast('Logged in as Maya Shrestha!', 'success');
      setTimeout(() => window.location.href = 'account.html', 500);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value?.trim();
      const pass = document.getElementById('loginPassword')?.value?.trim();

      if (!email || !pass) {
        showToast('Please enter both email and password.', 'error');
        return;
      }

      const user = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email: email,
        phone: '+977 9801000000',
        role: 'customer',
        address: 'Kathmandu Valley',
        area: 'Durbar Marg / Lazimpat',
        district: 'Kathmandu'
      };

      setCurrentUser(user);
      showToast('Welcome back to Himalayan Hearth!', 'success');
      setTimeout(() => window.location.href = 'account.html', 500);
    });
  }
}

// 2. Register Page Controller
export function initRegisterPage() {
  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName')?.value?.trim();
      const phone = document.getElementById('regPhone')?.value?.trim();
      const email = document.getElementById('regEmail')?.value?.trim();
      const pass = document.getElementById('regPassword')?.value?.trim();

      if (!name || !phone || !email || !pass) {
        showToast('Please complete all required fields.', 'error');
        return;
      }

      const newUser = {
        id: 'user_' + Date.now(),
        name,
        phone,
        email,
        role: 'customer',
        address: 'Kathmandu Valley',
        area: 'Durbar Marg / Lazimpat',
        district: 'Kathmandu'
      };

      setCurrentUser(newUser);
      showToast('Account registered successfully!', 'success');
      setTimeout(() => window.location.href = 'account.html', 600);
    });
  }
}

// 3. Customer Account Page Controller
export function initAccountPage() {
  const container = document.getElementById('accountContainer');
  if (!container) return;

  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 1rem;">
        <h2 class="font-serif" style="font-size: 1.75rem; color: var(--text-main); margin-bottom: 1rem;">Please Sign In</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Log in to access your saved orders, patron benefits, and addresses.</p>
        <a href="login.html" class="btn-primary">Go to Login</a>
      </div>
    `;
    return;
  }

  const allOrders = getOrders();
  // Filter for current user's orders or show all in demo
  const userOrders = allOrders;

  container.innerHTML = `
    <div style="max-width: 960px; margin: 0 auto;">
      <!-- Profile Header -->
      <div class="hearth-card" style="padding: 2rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--surface-high); border: 2px solid var(--primary); display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 1.5rem; font-weight: 700; font-family: var(--font-serif);">
            ${user.name.charAt(0)}
          </div>
          <div>
            <span class="label-caps" style="color:var(--primary);">Hearth Patron Account</span>
            <h1 class="font-serif" style="font-size: 1.75rem; color: var(--text-main); margin: 0.2rem 0;">${user.name}</h1>
            <div style="font-size: 0.8125rem; color: var(--text-dim);">
              ${user.phone} • ${user.email}
            </div>
          </div>
        </div>

        <button id="accountLogoutBtn" class="btn-outline btn-sm" style="color: var(--error); border-color: rgba(239, 68, 68, 0.3);">
          <span class="material-symbols-outlined text-sm">logout</span>
          <span>Sign Out</span>
        </button>
      </div>

      <!-- 2 Columns: Saved Info & Order History -->
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; align-items: start;">
        <!-- Left: Saved Delivery Sanctuary -->
        <div class="hearth-card" style="padding: 1.75rem;">
          <h3 class="font-serif" style="font-size: 1.125rem; color: var(--text-main); margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--outline-hairline);">
            Saved Address
          </h3>
          <div style="font-size: 0.875rem;">
            <div style="font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem;">Primary Residence</div>
            <div style="color: var(--text-muted); line-height: 1.5;">${user.address || 'Durbar Marg Heritage Quarter, Kathmandu'}</div>
            <div style="color: var(--primary); font-size: 0.8125rem; margin-top: 0.25rem;">Zone: ${user.area || 'Durbar Marg / Lazimpat'}</div>
          </div>
          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--outline-hairline);">
            <div class="label-caps" style="color: var(--primary); margin-bottom: 0.5rem;">Patron Perks</div>
            <ul style="font-size: 0.8125rem; color: var(--text-muted); list-style: none; display:flex; flex-direction:column; gap:0.4rem;">
              <li>✔ Complimentary Marpha Apple Cider on orders > Rs. 3000</li>
              <li>✔ Priority hearth-to-door heating courier</li>
            </ul>
          </div>
        </div>

        <!-- Right: Order History -->
        <div class="hearth-card" style="padding: 1.75rem;">
          <h3 class="font-serif" style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--outline-hairline);">
            Order History (${userOrders.length})
          </h3>

          ${userOrders.length === 0 ? `
            <p style="color: var(--text-dim); font-size: 0.875rem;">No orders placed yet.</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${userOrders.map(order => `
                <div style="background: var(--surface); border: 1px solid var(--outline-hairline); border-radius: 6px; padding: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <div>
                      <div style="font-weight: 700; color: var(--primary); font-size: 0.9375rem;">Order #${order.id}</div>
                      <div style="font-size: 0.75rem; color: var(--text-dim);">${new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                    <span class="status-pill status-${order.status}">
                      ${order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div style="font-size: 0.8125rem; color: var(--text-muted); margin: 0.5rem 0;">
                    ${order.items.map(i => `${i.name} (×${i.quantity})`).join(', ')}
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px dashed var(--outline-hairline);">
                    <div style="font-weight: 700; color: var(--text-main); font-size: 1rem;">${formatNPR(order.total)}</div>
                    <div style="display: flex; gap: 0.5rem;">
                      <a href="track-order.html?orderId=${order.id}" class="btn-outline btn-sm">Track</a>
                      <a href="order-confirmation.html?orderId=${order.id}" class="btn-primary btn-sm">Receipt</a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  document.getElementById('accountLogoutBtn')?.addEventListener('click', () => {
    logoutUser();
    showToast('Signed out successfully.');
    setTimeout(() => window.location.href = 'index.html', 500);
  });
}

// Auto-run handlers
if (document.getElementById('loginForm')) {
  document.addEventListener('DOMContentLoaded', initLoginPage);
}
if (document.getElementById('registerForm')) {
  document.addEventListener('DOMContentLoaded', initRegisterPage);
}
if (document.getElementById('accountContainer')) {
  document.addEventListener('DOMContentLoaded', initAccountPage);
}
