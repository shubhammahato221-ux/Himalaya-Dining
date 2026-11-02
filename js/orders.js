/**
 * HIMALAYAN HEARTH — ORDERS & TRACKING CONTROLLER
 * Powers both `order-confirmation.html` and `track-order.html`
 */

import { 
  getOrderById, 
  getLatestOrderId, 
  formatNPR, 
  updateOrderStatus, 
  getOrders 
} from './storage.js';
import { showToast } from './main.js';

// 1. Order Confirmation Controller
export function initOrderConfirmationPage() {
  const container = document.getElementById('confirmationContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  let orderId = urlParams.get('orderId') || getLatestOrderId();

  if (!orderId) {
    const orders = getOrders();
    orderId = orders[0]?.id;
  }

  const order = getOrderById(orderId);

  if (!order) {
    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 1rem;">
        <h2 class="font-serif" style="font-size: 1.75rem; color: var(--text-main); margin-bottom: 0.75rem;">No Order Record Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">We could not locate this order in our Kathmandu sanctuary register.</p>
        <a href="menu.html" class="btn-primary">Return to Menu</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="max-width: 780px; margin: 0 auto;">
      <!-- Celebration Header Card -->
      <div class="hearth-card" style="padding: 2.5rem; text-align: center; margin-bottom: 2rem; border-top: 4px solid var(--primary);">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(52, 211, 153, 0.15); border: 2px solid var(--success); color: var(--success); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
          <span class="material-symbols-outlined" style="font-size: 2.5rem;">check</span>
        </div>

        <span class="label-caps" style="color: var(--primary);">Dhanyabad • Thank You</span>
        <h1 class="font-serif" style="font-size: 2.25rem; color: var(--text-main); margin: 0.5rem 0;">Order Confirmed!</h1>
        <p style="color: var(--text-muted); font-size: 0.9375rem; max-width: 520px; margin: 0 auto 1.5rem;">
          Your artisanal order has been received by our kitchen. Our master chefs are preparing your mountain dishes with reverence.
        </p>

        <div style="display: inline-flex; align-items: center; gap: 1.5rem; background: var(--surface); padding: 0.85rem 1.5rem; border-radius: 4px; border: 1px solid var(--outline-hairline);">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Order Number</div>
            <div style="font-size: 1.125rem; font-weight: 700; color: var(--primary);">${order.id}</div>
          </div>
          <div style="width: 1px; height: 32px; background: var(--outline-hairline);"></div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Estimated Time</div>
            <div style="font-size: 1.125rem; font-weight: 700; color: var(--text-main);">${order.estimatedMinutes || 35} Mins</div>
          </div>
          <div style="width: 1px; height: 32px; background: var(--outline-hairline);"></div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Payment</div>
            <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-main);">${order.paymentMethod}</div>
          </div>
        </div>

        <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a href="track-order.html?orderId=${order.id}" class="btn-primary">
            <span class="material-symbols-outlined text-sm">fmd_good</span>
            <span>Track Order Live</span>
          </a>
          <button onclick="window.print()" class="btn-outline">
            <span class="material-symbols-outlined text-sm">print</span>
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      <!-- Receipt Breakdown Card -->
      <div class="hearth-card" style="padding: 2rem; margin-bottom: 2rem;">
        <h3 class="font-serif" style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--outline-hairline);">
          Order Details
        </h3>

        <!-- Items Table -->
        <div style="display:flex; flex-direction:column; gap:1rem; margin-bottom: 1.5rem;">
          ${order.items.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(212, 155, 68, 0.08);">
              <div style="display:flex; align-items:center; gap:1rem;">
                <img src="${item.image}" alt="${item.name}" style="width:54px; height:54px; border-radius:4px; object-fit:cover; border:1px solid var(--outline-hairline);">
                <div>
                  <div style="font-weight:600; color:var(--text-main); font-size:0.9375rem;">${item.name} × ${item.quantity}</div>
                  <div style="font-size:0.75rem; color:var(--primary);">${item.portion} ${item.addons && item.addons.length ? '• ' + item.addons.map(a => a.name).join(', ') : ''}</div>
                </div>
              </div>
              <div style="font-weight:600; color:var(--primary); font-size:0.9375rem;">${formatNPR(item.total)}</div>
            </div>
          `).join('')}
        </div>

        <!-- Financial Breakdown -->
        <div class="cart-summary-row">
          <span>Items Subtotal</span>
          <span>${formatNPR(order.subtotal)}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="cart-summary-row" style="color: var(--success);">
            <span>Discount Applied (${order.couponCode || 'Coupon'})</span>
            <span>-${formatNPR(order.discount)}</span>
          </div>
        ` : ''}
        <div class="cart-summary-row">
          <span>Delivery Charge</span>
          <span>${order.deliveryFee === 0 ? '<span style="color:var(--success); font-weight:700;">FREE</span>' : formatNPR(order.deliveryFee)}</span>
        </div>
        <div class="cart-summary-row">
          <span>13% Nepal Statutory VAT</span>
          <span>${formatNPR(order.vatTax)}</span>
        </div>
        <div class="cart-total-row">
          <span>Total Billed Amount</span>
          <span style="font-size:1.35rem;">${formatNPR(order.total)}</span>
        </div>

        <!-- Customer & Delivery Meta -->
        <div style="margin-top: 1.75rem; padding-top: 1.5rem; border-top: 1px solid var(--outline-hairline); display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; font-size: 0.875rem;">
          <div>
            <div class="label-caps" style="color:var(--primary); margin-bottom:0.25rem;">Customer Details</div>
            <div style="color:var(--text-main); font-weight:600;">${order.customer.name}</div>
            <div style="color:var(--text-muted);">${order.customer.phone}</div>
            ${order.customer.email ? `<div style="color:var(--text-dim); font-size:0.8125rem;">${order.customer.email}</div>` : ''}
          </div>

          <div>
            <div class="label-caps" style="color:var(--primary); margin-bottom:0.25rem;">
              ${order.orderType === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
            </div>
            ${order.orderType === 'pickup' ? `
              <div style="color:var(--text-main); font-weight:600;">Himalayan Hearth Kitchen Sanctuary</div>
              <div style="color:var(--text-muted);">Durbar Marg Heritage Quarter, Kathmandu</div>
            ` : `
              <div style="color:var(--text-main); font-weight:600;">${order.customer.street || ''}</div>
              <div style="color:var(--text-muted);">${order.customer.area || ''}, ${order.customer.district || 'Kathmandu'}</div>
              ${order.customer.landmark ? `<div style="font-size:0.75rem; color:var(--text-dim);">Landmark: ${order.customer.landmark}</div>` : ''}
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

// 2. Order Tracking Timeline Controller
export function initOrderTrackingPage() {
  const container = document.getElementById('trackingContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  let orderId = urlParams.get('orderId') || getLatestOrderId();

  if (!orderId) {
    const orders = getOrders();
    orderId = orders[0]?.id;
  }

  function renderTracking(activeId) {
    const order = getOrderById(activeId);

    if (!order) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <h2 class="font-serif" style="font-size: 1.75rem; color: var(--text-main); margin-bottom: 0.75rem;">Order Not Found</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Please check the Order ID and try again.</p>
          <div style="max-width: 400px; margin: 0 auto;">
            <form id="trackSearchForm" style="display:flex; gap:0.5rem;">
              <input type="text" id="trackSearchInput" class="form-control" placeholder="e.g. HH-KT-9042" required>
              <button type="submit" class="btn-primary btn-sm">Track</button>
            </form>
          </div>
        </div>
      `;
      setupSearchListener();
      return;
    }

    const steps = [
      { key: 'placed', title: 'Order Placed', desc: 'Received in Kitchen', icon: 'receipt_long' },
      { key: 'confirmed', title: 'Confirmed', desc: 'Maitre d\' Verified', icon: 'fact_check' },
      { key: 'preparing', title: 'Wood-Fired Hearth', desc: 'Clay ovens heating', icon: 'local_fire_department' },
      { key: 'out_for_delivery', title: 'Out For Delivery', desc: 'Rider on the way', icon: 'two_wheeler' },
      { key: 'delivered', title: 'Delivered', desc: 'At your doorstep', icon: 'home' }
    ];

    const currentStepIdx = steps.findIndex(s => s.key === order.status);
    const progressPercent = currentStepIdx === -1 ? 0 : (currentStepIdx / (steps.length - 1)) * 80;

    container.innerHTML = `
      <div style="max-width: 840px; margin: 0 auto;">
        <!-- Order Header Search & Info -->
        <div class="hearth-card" style="padding: 1.75rem; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--outline-hairline);">
            <div>
              <span class="label-caps" style="color:var(--primary);">Live Order Tracking</span>
              <h2 class="font-serif" style="font-size: 1.75rem; color: var(--text-main);">Order #${order.id}</h2>
            </div>
            
            <form id="trackSearchForm" style="display:flex; gap:0.5rem;">
              <input type="text" id="trackSearchInput" class="form-control" value="${order.id}" style="width: 160px; font-size: 0.875rem;" required>
              <button type="submit" class="btn-outline btn-sm">Find</button>
            </form>
          </div>

          <!-- Stepper Visual -->
          <div class="tracking-stepper">
            <div class="tracking-progress-fill" style="width: ${progressPercent}%;"></div>
            
            ${steps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;
              const stateClass = isActive ? 'active' : (isCompleted ? 'completed' : '');
              return `
                <div class="step-item ${stateClass}">
                  <div class="step-icon-wrap">
                    <span class="material-symbols-outlined" style="font-size: 20px;">${step.icon}</span>
                  </div>
                  <div>
                    <div class="step-title">${step.title}</div>
                    <div class="step-desc">${step.desc}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Live Status Banner & Rider Details -->
          <div style="background: var(--surface); border: 1px solid var(--outline-hairline); border-radius: 6px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--surface-high); border: 1px solid var(--primary); display: flex; align-items: center; justify-content: center; color: var(--primary);">
                <span class="material-symbols-outlined">${order.status === 'out_for_delivery' ? 'two_wheeler' : 'restaurant'}</span>
              </div>
              <div>
                <div style="font-weight: 600; color: var(--text-main); font-size: 0.9375rem;">
                  ${getStatusMessage(order.status, order.customer.name)}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-dim);">
                  Destination: ${order.orderType === 'pickup' ? 'Durbar Marg Sanctuary Pickup' : (order.customer.street + ', ' + (order.customer.area || 'Kathmandu'))}
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <a href="tel:+97714412345" class="btn-outline btn-sm">
                <span class="material-symbols-outlined text-sm">call</span>
                <span>Call Kitchen</span>
              </a>
            </div>
          </div>

          <!-- Interactive Demo: Step simulation buttons -->
          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--outline-hairline); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <span style="font-size:0.75rem; color:var(--text-dim);">Simulate Order Stage for Testing:</span>
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
              ${steps.map(s => `
                <button class="simulate-status-btn btn-outline btn-sm" data-status="${s.key}" style="font-size:0.7rem; padding:3px 8px; ${order.status === s.key ? 'border-color:var(--primary); color:var(--primary);' : ''}">
                  ${s.title}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Ordered Items Summary -->
        <div class="hearth-card" style="padding: 1.75rem;">
          <h3 class="font-serif" style="font-size: 1.125rem; color: var(--text-main); margin-bottom: 1rem;">Dishes in this Dispatch</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${order.items.map(item => `
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.875rem;">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <img src="${item.image}" alt="${item.name}" style="width:42px; height:42px; border-radius:4px; object-fit:cover;">
                  <div>
                    <span style="color:var(--text-main); font-weight:600;">${item.name}</span>
                    <span style="color:var(--primary); margin-left:6px;">× ${item.quantity}</span>
                  </div>
                </div>
                <span style="font-weight:600; color:var(--primary);">${formatNPR(item.total)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setupSearchListener();

    // Simulation status buttons
    container.querySelectorAll('.simulate-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextStatus = btn.getAttribute('data-status');
        updateOrderStatus(order.id, nextStatus);
        showToast(`Status updated to "${nextStatus.replace('_', ' ').toUpperCase()}"`, 'info');
        renderTracking(order.id);
      });
    });
  }

  function getStatusMessage(status, name) {
    if (status === 'placed') return 'Order Placed — Kitchen review in progress.';
    if (status === 'confirmed') return 'Order Confirmed — Ingredients assembled.';
    if (status === 'preparing') return 'Cooking in Hearth — Fresh clay oven & slow heat.';
    if (status === 'out_for_delivery') return 'Out for Delivery — Rider Bikash Shrestha (+977 9841234567) is en route.';
    if (status === 'delivered') return 'Delivered — Enjoy your Himalayan Hearth culinary feast!';
    return 'Status: ' + status;
  }

  function setupSearchListener() {
    const form = document.getElementById('trackSearchForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = document.getElementById('trackSearchInput')?.value?.trim();
        if (val) renderTracking(val);
      });
    }
  }

  renderTracking(orderId);
}

// Auto-run handlers
if (document.getElementById('confirmationContainer')) {
  document.addEventListener('DOMContentLoaded', initOrderConfirmationPage);
}
if (document.getElementById('trackingContainer')) {
  document.addEventListener('DOMContentLoaded', initOrderTrackingPage);
}
