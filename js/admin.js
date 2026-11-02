/**
 * HIMALAYAN HEARTH — RESTAURANT ADMIN DASHBOARD CONTROLLER
 * Real-time Order Operations, Menu Management, Price Adjustments,
 * Availability Toggling, and Coupon System.
 */

import { 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  getMenuItems, 
  updateMenuItem, 
  addMenuItem, 
  toggleMenuItemAvailability, 
  getAdminAnalytics, 
  formatNPR, 
  getCoupons, 
  addCoupon,
  isAdminLoggedIn,
  setAdminLoggedIn
} from './storage.js';
import { showToast } from './main.js';

let currentTab = 'orders';
let orderStatusFilter = 'all';
let orderSearchQuery = '';

export function initAdminPage() {
  const container = document.getElementById('adminPageContainer');
  if (!container) return;

  function renderAdmin() {
    // Check authentication
    if (!isAdminLoggedIn()) {
      renderAdminLoginGate();
      return;
    }

    const analytics = getAdminAnalytics();
    const menuItems = getMenuItems();

    container.innerHTML = `
      <div>
        <!-- Admin Header Bar -->
        <div class="admin-header">
          <div class="container admin-nav-bar">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <span class="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
              <div>
                <span class="font-serif" style="font-size:1.125rem; color:var(--text-main); font-weight:700;">HIMALAYAN HEARTH</span>
                <span class="admin-badge" style="margin-left:0.5rem;">Kitchen Operations & Concierge</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:1rem;">
              <a href="index.html" class="btn-outline btn-sm">
                <span class="material-symbols-outlined text-sm">visibility</span>
                <span>Customer Site</span>
              </a>
              <button id="adminLogoutBtn" class="btn-outline btn-sm" style="color:var(--error); border-color:rgba(239,68,68,0.3);">
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
          <!-- KPI Metrics Row -->
          <div class="admin-kpi-grid">
            <div class="kpi-card">
              <span class="kpi-label">Gross Revenue</span>
              <span class="kpi-value text-gold">${formatNPR(analytics.totalRevenue)}</span>
              <span class="kpi-subtext"><span class="material-symbols-outlined text-xs">trending_up</span> From active orders</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Total Orders</span>
              <span class="kpi-value">${analytics.totalOrders}</span>
              <span class="kpi-subtext"><span class="material-symbols-outlined text-xs">receipt</span> Lifetime customer dispatches</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Pending / Kitchen</span>
              <span class="kpi-value" style="color:#fbbf24;">${analytics.pendingOrders + analytics.inKitchen}</span>
              <span class="kpi-subtext" style="color:#fbbf24;"><span class="material-symbols-outlined text-xs">local_fire_department</span> Active hearth cooking</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Menu Items</span>
              <span class="kpi-value">${menuItems.length}</span>
              <span class="kpi-subtext"><span class="material-symbols-outlined text-xs">restaurant_menu</span> ${menuItems.filter(i=>i.available).length} Live Available</span>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="admin-tabs">
            <button class="admin-tab-btn ${currentTab === 'orders' ? 'active' : ''}" data-tab="orders">
              Live Order Management
            </button>
            <button class="admin-tab-btn ${currentTab === 'menu' ? 'active' : ''}" data-tab="menu">
              Menu & Availability
            </button>
            <button class="admin-tab-btn ${currentTab === 'coupons' ? 'active' : ''}" data-tab="coupons">
              Promotional Coupons
            </button>
          </div>

          <!-- Tab Content Display -->
          <div id="adminTabContent">
            ${currentTab === 'orders' ? renderOrdersTab() : ''}
            ${currentTab === 'menu' ? renderMenuTab() : ''}
            ${currentTab === 'coupons' ? renderCouponsTab() : ''}
          </div>
        </div>
      </div>
    `;

    // Logout
    document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
      setAdminLoggedIn(false);
      showToast('Admin logged out.');
      renderAdmin();
    });

    // Tab buttons
    container.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.getAttribute('data-tab');
        renderAdmin();
      });
    });

    // Attach tab specific listeners
    if (currentTab === 'orders') attachOrdersTabEvents();
    if (currentTab === 'menu') attachMenuTabEvents();
    if (currentTab === 'coupons') attachCouponsTabEvents();
  }

  function renderAdminLoginGate() {
    container.innerHTML = `
      <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
        <div class="hearth-card" style="width: 100%; max-width: 440px; padding: 2.5rem; text-align: center;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--surface-high); border: 1px solid var(--primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; color: var(--primary);">
            <span class="material-symbols-outlined" style="font-size: 1.75rem;">lock</span>
          </div>

          <span class="label-caps" style="color:var(--primary);">Himalayan Hearth</span>
          <h2 class="font-serif" style="font-size: 1.65rem; color: var(--text-main); margin: 0.25rem 0 1rem;">Kitchen Admin Portal</h2>
          <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1.5rem;">Authorized access for chefs, dispatchers, and restaurant management.</p>

          <form id="adminAuthForm" style="display:flex; flex-direction:column; gap:1rem; text-align:left;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="adminEmail">Manager Email</label>
              <input type="email" id="adminEmail" class="form-control" value="admin@himalayanhearth.com" required>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" for="adminPass">Password</label>
              <input type="password" id="adminPass" class="form-control" value="hearthadmin" required>
            </div>
            <button type="submit" class="btn-primary" style="width:100%; height:46px; margin-top:0.5rem;">
              Unlock Admin Console
            </button>
          </form>

          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--outline-hairline);">
            <button id="quickAdminAccessBtn" class="btn-outline btn-sm" style="width:100%;">
              ⚡ 1-Click Quick Demo Access
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('adminAuthForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      setAdminLoggedIn(true);
      showToast('Welcome, Hearth Operations Manager!', 'success');
      renderAdmin();
    });

    document.getElementById('quickAdminAccessBtn')?.addEventListener('click', () => {
      setAdminLoggedIn(true);
      showToast('Authenticated as Admin!', 'success');
      renderAdmin();
    });
  }

  // ORDERS TAB RENDER
  function renderOrdersTab() {
    let orders = getOrders();

    if (orderStatusFilter !== 'all') {
      orders = orders.filter(o => o.status === orderStatusFilter);
    }

    if (orderSearchQuery.trim() !== '') {
      const q = orderSearchQuery.toLowerCase().trim();
      orders = orders.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map(st => `
              <button class="filter-pill ${orderStatusFilter === st ? 'active' : ''} order-filter-pill" data-status="${st}">
                ${st === 'all' ? 'All Orders' : st.replace('_', ' ').toUpperCase()}
              </button>
            `).join('')}
          </div>

          <div style="width: 260px;">
            <input type="text" id="orderSearchInput" class="form-control" placeholder="Search by Order # or Name..." value="${orderSearchQuery}" style="font-size:0.8125rem;">
          </div>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items Summary</th>
                <th>Total (NPR)</th>
                <th>Payment</th>
                <th>Kitchen Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${orders.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align:center; padding:3rem; color:var(--text-dim);">
                    No orders match your current filter.
                  </td>
                </tr>
              ` : orders.map(order => `
                <tr>
                  <td>
                    <strong style="color:var(--primary);">${order.id}</strong>
                    <div style="font-size:0.75rem; color:var(--text-dim);">${new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td>
                    <div style="font-weight:600; color:var(--text-main);">${order.customer.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-dim);">${order.customer.phone}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${order.customer.area || 'Kathmandu'}</div>
                  </td>
                  <td>
                    <div style="font-size:0.8125rem; color:var(--text-main); max-width:260px;">
                      ${order.items.map(i => `${i.name} (×${i.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td>
                    <strong style="color:var(--primary); font-size:0.9375rem;">${formatNPR(order.total)}</strong>
                  </td>
                  <td>
                    <span style="font-size:0.75rem; font-weight:600; color:${order.paymentStatus.includes('Paid') ? 'var(--success)' : '#fbbf24'};">
                      ${order.paymentMethod} • ${order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <select class="admin-status-dropdown form-control" data-order-id="${order.id}" style="padding:4px 8px; font-size:0.75rem; height:32px; width:140px;">
                      <option value="placed" ${order.status === 'placed' ? 'selected' : ''}>Placed</option>
                      <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                      <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing (Hearth)</option>
                      <option value="out_for_delivery" ${order.status === 'out_for_delivery' ? 'selected' : ''}>Out for Delivery</option>
                      <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-outline btn-sm view-slip-btn" data-order-id="${order.id}">
                      Full Slip
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function attachOrdersTabEvents() {
    // Filter pills
    container.querySelectorAll('.order-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        orderStatusFilter = btn.getAttribute('data-status');
        renderAdmin();
      });
    });

    // Search input
    const sInput = document.getElementById('orderSearchInput');
    if (sInput) {
      let timeout;
      sInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          orderSearchQuery = e.target.value;
          renderAdmin();
        }, 200);
      });
    }

    // Status dropdowns
    container.querySelectorAll('.admin-status-dropdown').forEach(dropdown => {
      dropdown.addEventListener('change', (e) => {
        const orderId = dropdown.getAttribute('data-order-id');
        const nextStatus = e.target.value;
        updateOrderStatus(orderId, nextStatus);
        showToast(`Order #${orderId} status set to ${nextStatus.toUpperCase()}`, 'success');
        renderAdmin();
      });
    });

    // Full slip modal view
    container.querySelectorAll('.view-slip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-order-id');
        window.location.href = `order-confirmation.html?orderId=${orderId}`;
      });
    });
  }

  // MENU TAB RENDER
  function renderMenuTab() {
    const dishes = getMenuItems();

    return `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3 class="font-serif" style="font-size:1.25rem; color:var(--text-main);">Dishes & Live Stock Management</h3>
          <button id="openAddDishModalBtn" class="btn-primary btn-sm">
            <span class="material-symbols-outlined text-sm">add</span>
            <span>Add New Dish</span>
          </button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price (NPR)</th>
                <th>Availability</th>
                <th>Quick Edit</th>
              </tr>
            </thead>
            <tbody>
              ${dishes.map(dish => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                      <img src="${dish.image}" alt="${dish.name}" style="width:44px; height:44px; border-radius:4px; object-fit:cover; border:1px solid var(--outline-hairline);">
                      <div>
                        <div style="font-weight:600; color:var(--text-main); font-size:0.875rem;">${dish.name}</div>
                        <div style="font-size:0.75rem; color:var(--primary); font-family:var(--font-serif);">${dish.nepaliName || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-dim);">${dish.categoryName || dish.category}</span>
                  </td>
                  <td>
                    <span class="${dish.isVeg ? 'badge-veg' : 'badge-nonveg'}" style="position:static; display:inline-flex;">
                      <span style="font-size:8px;">●</span> ${dish.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </td>
                  <td>
                    <strong style="color:var(--primary); font-size:0.9375rem;">${formatNPR(dish.price)}</strong>
                  </td>
                  <td>
                    <label class="switch">
                      <input type="checkbox" class="toggle-stock-cb" data-dish-id="${dish.id}" ${dish.available ? 'checked' : ''}>
                      <span class="slider"></span>
                    </label>
                    <span style="margin-left:0.5rem; font-size:0.75rem; color:${dish.available ? 'var(--success)' : 'var(--error)'}; font-weight:600;">
                      ${dish.available ? 'In Stock' : 'Sold Out'}
                    </span>
                  </td>
                  <td>
                    <button class="btn-outline btn-sm quick-price-edit-btn" data-dish-id="${dish.id}" data-current-price="${dish.price}">
                      Edit Price
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function attachMenuTabEvents() {
    // Toggle stock
    container.querySelectorAll('.toggle-stock-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const dishId = cb.getAttribute('data-dish-id');
        const newState = toggleMenuItemAvailability(dishId);
        showToast(`Dish availability toggled: ${newState ? 'IN STOCK' : 'SOLD OUT'}`, 'info');
        renderAdmin();
      });
    });

    // Quick price edit
    container.querySelectorAll('.quick-price-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dishId = btn.getAttribute('data-dish-id');
        const currentPrice = btn.getAttribute('data-current-price');
        const input = prompt('Enter new price in NPR (e.g. 1500):', currentPrice);
        if (input && !isNaN(input) && Number(input) > 0) {
          updateMenuItem(dishId, { price: Number(input) });
          showToast(`Price updated to ${formatNPR(input)}`, 'success');
          renderAdmin();
        }
      });
    });

    // Open add dish modal
    document.getElementById('openAddDishModalBtn')?.addEventListener('click', () => {
      const name = prompt('Dish English Name (e.g. Clay-Pot Sekuwa):');
      if (!name) return;
      const nepali = prompt('Dish Nepali Name (e.g. माटोको हाँडी सेकुवा):') || '';
      const price = prompt('Price in NPR (e.g. 1200):') || '1000';
      const category = prompt('Category (himalayan, momo, thakali, woodfired, noodles, rice, snacks, dessert, beverage):') || 'woodfired';
      const isVeg = confirm('Is this dish Pure Vegetarian? OK for Yes, Cancel for Non-Veg');

      addMenuItem({
        name,
        nepaliName: nepali,
        price: Number(price),
        category,
        categoryName: category.toUpperCase(),
        isVeg,
        description: 'Authentic wood-fired specialty crafted with heirloom mountain herbs.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        available: true,
        spiceLevel: 'Chef Curated'
      });

      showToast(`Added ${name} to Himalayan Hearth menu!`, 'success');
      renderAdmin();
    });
  }

  // COUPONS TAB RENDER
  function renderCouponsTab() {
    const coupons = getCoupons();

    return `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3 class="font-serif" style="font-size:1.25rem; color:var(--text-main);">Promotional Coupons & Deals</h3>
          <button id="openAddCouponBtn" class="btn-primary btn-sm">
            <span class="material-symbols-outlined text-sm">add</span>
            <span>Create Coupon</span>
          </button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount Value</th>
                <th>Min. Order</th>
                <th>Terms & Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${coupons.map(c => `
                <tr>
                  <td>
                    <strong style="color:var(--primary); font-size:1rem; letter-spacing:0.05em;">${c.code}</strong>
                  </td>
                  <td>
                    <span style="font-weight:700; color:var(--success);">
                      ${c.type === 'percent' ? c.value + '% OFF' : formatNPR(c.value) + ' OFF'}
                    </span>
                  </td>
                  <td>
                    <span style="color:var(--text-main);">${formatNPR(c.minOrder)}</span>
                  </td>
                  <td>
                    <span style="color:var(--text-muted); font-size:0.8125rem;">${c.description}</span>
                  </td>
                  <td>
                    <span class="status-pill status-delivered">Active</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function attachCouponsTabEvents() {
    document.getElementById('openAddCouponBtn')?.addEventListener('click', () => {
      const code = prompt('Coupon Code (e.g. DASHAIN25):');
      if (!code) return;
      const val = prompt('Discount Percentage (e.g. 15 for 15%):') || '10';
      const minOrder = prompt('Minimum Order in NPR (e.g. 1500):') || '1000';

      addCoupon({
        code: code.trim().toUpperCase(),
        type: 'percent',
        value: Number(val),
        minOrder: Number(minOrder),
        description: `${val}% off on orders above ${formatNPR(minOrder)}`
      });

      showToast(`Coupon ${code.toUpperCase()} added!`, 'success');
      renderAdmin();
    });
  }

  renderAdmin();
}

if (document.getElementById('adminPageContainer')) {
  document.addEventListener('DOMContentLoaded', initAdminPage);
}
