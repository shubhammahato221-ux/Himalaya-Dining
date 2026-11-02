/**
 * HIMALAYAN HEARTH — GLOBAL APPLICATION CONTROLLER
 * Initializes global navigation, cart badges, slideout drawer,
 * toast notifications, and shared reservation features.
 */

import { 
  getCart, 
  getCartCount, 
  calculateCartTotals, 
  updateCartQuantity, 
  removeFromCart, 
  formatNPR, 
  getMenuItemById, 
  addToCart 
} from './storage.js';

// Global Toast System
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  
  const icon = type === 'error' ? 'error' : (type === 'success' ? 'check_circle' : 'info');
  toast.innerHTML = `
    <span class="material-symbols-outlined text-primary text-xl">${icon}</span>
    <span style="flex-grow: 1;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Update Cart Badges across current page
export function updateCartBadges() {
  const count = getCartCount();
  const badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

// Render Global Cart Drawer
export function renderCartDrawer() {
  let overlay = document.getElementById('cartDrawerOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'cartDrawerOverlay';
    overlay.className = 'cart-drawer-overlay';
    overlay.innerHTML = `
      <aside class="cart-drawer" role="dialog" aria-label="Shopping Cart">
        <div class="cart-drawer-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="material-symbols-outlined text-primary">local_mall</span>
            <h3 class="font-serif" style="font-size: 1.125rem; font-weight: 600; color: var(--text-main);">Your Hearth Feast</h3>
          </div>
          <button class="modal-close-btn" id="closeCartDrawerBtn" aria-label="Close Cart">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div class="cart-drawer-body" id="cartDrawerItemsList">
          <!-- Dynamic Items Injected Here -->
        </div>
        <div class="cart-drawer-footer" id="cartDrawerFooter">
          <!-- Dynamic Totals Injected Here -->
        </div>
      </aside>
    `;
    document.body.appendChild(overlay);

    // Close listeners
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeCartDrawer();
    });
    document.getElementById('closeCartDrawerBtn')?.addEventListener('click', closeCartDrawer);
  }

  const itemsList = document.getElementById('cartDrawerItemsList');
  const footer = document.getElementById('cartDrawerFooter');
  const cart = getCart();
  const totals = calculateCartTotals();

  if (!cart || cart.length === 0) {
    itemsList.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-dim);">
        <span class="material-symbols-outlined" style="font-size: 3.5rem; color: var(--primary); opacity: 0.7; margin-bottom: 1rem;">shopping_basket</span>
        <h4 class="font-serif" style="font-size: 1.125rem; color: var(--text-main); margin-bottom: 0.5rem;">Your Cart is Empty</h4>
        <p style="font-size: 0.8125rem; margin-bottom: 1.5rem;">Experience artisanal momos, slow-braised khasi, and mountain spices from our hearth.</p>
        <a href="menu.html" class="btn-primary btn-sm" onclick="closeCartDrawer()">Explore Menu</a>
      </div>
    `;
    footer.innerHTML = '';
    return;
  }

  itemsList.innerHTML = cart.map((item, idx) => `
    <div style="display:flex; gap:0.85rem; padding-bottom:1rem; border-bottom:1px solid var(--outline-hairline); position:relative;">
      <img src="${item.image}" alt="${item.name}" style="width:68px; height:68px; border-radius:4px; object-fit:cover; border:1px solid var(--outline-hairline); flex-shrink:0;">
      <div style="flex-grow:1;">
        <div style="display:flex; justify-content:space-between; align-items:start;">
          <h4 style="font-size:0.9rem; font-weight:600; color:var(--text-main);">${item.name}</h4>
          <button data-remove-idx="${idx}" class="drawer-remove-item" style="color:var(--text-dim); padding:2px;" title="Remove">
            <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
          </button>
        </div>
        <div style="font-size:0.75rem; color:var(--primary); margin:2px 0;">
          ${item.portion || 'Regular'} ${item.addons && item.addons.length ? '• ' + item.addons.map(a => a.name).join(', ') : ''}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.4rem;">
          <span style="font-weight:700; color:var(--text-main); font-size:0.875rem;">${formatNPR(item.total)}</span>
          <div class="qty-stepper" style="height:28px;">
            <button class="qty-btn drawer-qty-minus" data-idx="${idx}" style="width:28px; height:28px;">-</button>
            <span class="qty-val" style="min-width:28px; font-size:0.8125rem;">${item.quantity}</span>
            <button class="qty-btn drawer-qty-plus" data-idx="${idx}" style="width:28px; height:28px;">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  footer.innerHTML = `
    <div class="cart-summary-row">
      <span>Subtotal</span>
      <span>${formatNPR(totals.subtotal)}</span>
    </div>
    ${totals.discount > 0 ? `
    <div class="cart-summary-row" style="color: var(--success);">
      <span>Discount (${totals.appliedCoupon.code})</span>
      <span>-${formatNPR(totals.discount)}</span>
    </div>
    ` : ''}
    <div class="cart-summary-row">
      <span>Estimated Valley Delivery</span>
      <span>${totals.deliveryFee === 0 ? '<span style="color:var(--success);">FREE</span>' : formatNPR(totals.deliveryFee)}</span>
    </div>
    <div class="cart-total-row">
      <span>Total (inc. VAT)</span>
      <span>${formatNPR(totals.grandTotal)}</span>
    </div>
    <div style="display:flex; gap:0.75rem; margin-top:1.25rem;">
      <a href="cart.html" class="btn-outline btn-sm" style="flex:1; text-align:center;">View Cart</a>
      <a href="checkout.html" class="btn-primary btn-sm" style="flex:1; text-align:center;">Checkout</a>
    </div>
  `;

  // Attach Stepper & Remove Events in Drawer
  itemsList.querySelectorAll('.drawer-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      updateCartQuantity(idx, cart[idx].quantity + 1);
      renderCartDrawer();
      updateCartBadges();
    });
  });

  itemsList.querySelectorAll('.drawer-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      updateCartQuantity(idx, cart[idx].quantity - 1);
      renderCartDrawer();
      updateCartBadges();
    });
  });

  itemsList.querySelectorAll('.drawer-remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-remove-idx'));
      removeFromCart(idx);
      renderCartDrawer();
      updateCartBadges();
      showToast('Item removed from cart.');
    });
  });
}

export function openCartDrawer() {
  renderCartDrawer();
  const overlay = document.getElementById('cartDrawerOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function closeCartDrawer() {
  const overlay = document.getElementById('cartDrawerOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Global Food Details Modal
export function openFoodDetailsModal(dishId) {
  const dish = getMenuItemById(dishId);
  if (!dish) {
    showToast('Food item not found.', 'error');
    return;
  }

  let modalOverlay = document.getElementById('foodModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'foodModalOverlay';
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  let currentPortion = dish.portions ? dish.portions[0] : { name: 'Regular', priceMod: 0 };
  let selectedAddons = [];
  let quantity = 1;

  function calculateModalTotal() {
    const base = dish.price + currentPortion.priceMod;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return (base + addonsTotal) * quantity;
  }

  function renderModalBody() {
    modalOverlay.innerHTML = `
      <div class="modal-content">
        <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div style="height: 280px; position: relative; overflow: hidden; background: var(--surface);">
          <img src="${dish.image}" alt="${dish.name}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; background: linear-gradient(to top, var(--surface-container), transparent);">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
              <span class="${dish.isVeg ? 'badge-veg' : 'badge-nonveg'}" style="position:static;">
                <span style="font-size:8px;">●</span> ${dish.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
              </span>
              <span class="food-badge" style="position:static;">${dish.spiceLevel || 'Standard Spicing'}</span>
            </div>
            <h2 class="font-serif" style="font-size: 1.5rem; color: var(--text-main); font-weight: 700;">${dish.name}</h2>
            <div style="font-size: 0.8125rem; color: var(--primary); font-family: var(--font-serif);">${dish.nepaliName || ''}</div>
          </div>
        </div>

        <div style="padding: 1.5rem 1.75rem;">
          <p style="font-size: 0.9375rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            ${dish.description}
          </p>

          <!-- Portion Selection -->
          ${dish.portions && dish.portions.length > 1 ? `
          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="display:block; margin-bottom:0.5rem;">Select Portion Size</label>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${dish.portions.map((p, idx) => `
                <label style="display:flex; justify-content:space-between; align-items:center; padding:0.65rem 1rem; border:1px solid ${currentPortion.name === p.name ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${currentPortion.name === p.name ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.6rem;">
                    <input type="radio" name="portionOption" value="${idx}" ${currentPortion.name === p.name ? 'checked' : ''} style="accent-color:var(--primary);">
                    <span style="font-size:0.875rem; color:var(--text-main); font-weight:500;">${p.name}</span>
                  </div>
                  <span style="font-size:0.875rem; color:var(--primary); font-weight:600;">
                    ${p.priceMod > 0 ? '+' + formatNPR(p.priceMod) : 'Standard'}
                  </span>
                </label>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Addons -->
          ${dish.addons && dish.addons.length > 0 ? `
          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="display:block; margin-bottom:0.5rem;">Artisanal Add-ons & Sides</label>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${dish.addons.map((a, idx) => {
                const isSelected = selectedAddons.some(sel => sel.name === a.name);
                return `
                <label style="display:flex; justify-content:space-between; align-items:center; padding:0.65rem 1rem; border:1px solid ${isSelected ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${isSelected ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.6rem;">
                    <input type="checkbox" class="addon-checkbox" data-addon-idx="${idx}" ${isSelected ? 'checked' : ''} style="accent-color:var(--primary);">
                    <span style="font-size:0.875rem; color:var(--text-main);">${a.name}</span>
                  </div>
                  <span style="font-size:0.875rem; color:var(--primary); font-weight:600;">+${formatNPR(a.price)}</span>
                </label>
                `;
              }).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Special Instructions -->
          <div style="margin-bottom: 1.5rem;">
            <label class="form-label" for="dishSpecialNotes" style="display:block; margin-bottom:0.4rem;">Special Cooking Instructions</label>
            <input type="text" id="dishSpecialNotes" class="form-control" placeholder="e.g. Less spicy, extra lemon on side..." style="font-size:0.875rem;">
          </div>

          <!-- Quantity & Add Button Action -->
          <div style="display:flex; justify-content:space-between; align-items:center; pt:1rem; border-top:1px solid var(--outline-hairline);">
            <div class="qty-stepper">
              <button class="qty-btn" id="modalQtyMinus">-</button>
              <span class="qty-val" id="modalQtyVal">${quantity}</span>
              <button class="qty-btn" id="modalQtyPlus">+</button>
            </div>
            <button class="btn-primary" id="modalAddToCartBtn">
              <span>Add To Order</span>
              <span id="modalTotalDisplay">• ${formatNPR(calculateModalTotal())}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Modal Close
    modalOverlay.querySelector('#modalCloseBtn').addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    // Portion Change
    modalOverlay.querySelectorAll('input[name="portionOption"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value);
        currentPortion = dish.portions[idx];
        renderModalBody();
      });
    });

    // Addons Change
    modalOverlay.querySelectorAll('.addon-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const idx = parseInt(cb.getAttribute('data-addon-idx'));
        const addon = dish.addons[idx];
        if (cb.checked) {
          selectedAddons.push(addon);
        } else {
          selectedAddons = selectedAddons.filter(a => a.name !== addon.name);
        }
        document.getElementById('modalTotalDisplay').textContent = '• ' + formatNPR(calculateModalTotal());
      });
    });

    // Quantity Stepper
    modalOverlay.querySelector('#modalQtyPlus').addEventListener('click', () => {
      quantity++;
      document.getElementById('modalQtyVal').textContent = quantity;
      document.getElementById('modalTotalDisplay').textContent = '• ' + formatNPR(calculateModalTotal());
    });

    modalOverlay.querySelector('#modalQtyMinus').addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        document.getElementById('modalQtyVal').textContent = quantity;
        document.getElementById('modalTotalDisplay').textContent = '• ' + formatNPR(calculateModalTotal());
      }
    });

    // Add to Cart
    modalOverlay.querySelector('#modalAddToCartBtn').addEventListener('click', () => {
      const instructions = document.getElementById('dishSpecialNotes')?.value || '';
      addToCart(dish, quantity, {
        portion: currentPortion.name,
        portionPriceMod: currentPortion.priceMod,
        addons: selectedAddons,
        instructions: instructions
      });
      modalOverlay.classList.remove('active');
      updateCartBadges();
      showToast(`Added ${dish.name} (${quantity}) to cart!`, 'success');
      openCartDrawer();
    });
  }

  renderModalBody();
  modalOverlay.classList.add('active');

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNavDrawer');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      const icon = mobileBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = mobileNav.classList.contains('active') ? 'close' : 'menu';
      }
    });
  }

  // 2. Global Cart Drawer Triggers
  document.querySelectorAll('.cart-btn-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  // 3. Listen for Cart Updates
  window.addEventListener('hearth_cart_updated', () => {
    updateCartBadges();
  });
  updateCartBadges();

  // 4. Quick Table Reservation Form Handler
  const resForm = document.getElementById('reservationForm');
  if (resForm) {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
      dateInput.min = today;
      if (!dateInput.value) dateInput.value = today;
    }

    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guestName')?.value || 'Guest';
      const toastMsg = `Table inquiry received for ${guestName}! Our Maitre d' will confirm your booking within 15 minutes.`;
      showToast(toastMsg, 'success');
      resForm.reset();
      if (dateInput) dateInput.value = today;
    });
  }
});
