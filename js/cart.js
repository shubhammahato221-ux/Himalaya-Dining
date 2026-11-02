/**
 * HIMALAYAN HEARTH — SHOPPING CART CONTROLLER
 * Manages the dedicated Cart Page: item modifications,
 * coupon application/removal, delivery fee rules, and checkout handoff.
 */

import { 
  getCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart, 
  formatNPR, 
  calculateCartTotals, 
  applyCoupon, 
  removeCoupon 
} from './storage.js';
import { showToast, updateCartBadges } from './main.js';

export function initCartPage() {
  const container = document.getElementById('cartPageContainer');
  if (!container) return;

  function renderCart() {
    const cart = getCart();
    const totals = calculateCartTotals();

    if (!cart || cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 5rem 1rem; max-width: 600px; margin: 0 auto;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--surface-container); border: 1px solid var(--outline-hairline); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: var(--primary);">
            <span class="material-symbols-outlined" style="font-size: 2.5rem;">shopping_bag</span>
          </div>
          <h2 class="font-serif" style="font-size: 1.85rem; color: var(--text-main); margin-bottom: 0.75rem;">Your Cart is Empty</h2>
          <p style="color: var(--text-muted); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 2rem;">
            Explore our curated menu of slow-braised mountain meats, artisanal momos, and heirloom Kathmandu recipes.
          </p>
          <a href="menu.html" class="btn-primary">
            <span>Explore Artisanal Menu</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="cart-layout">
        <!-- Left: Cart Items List -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--outline-hairline);">
            <h2 class="font-serif" style="font-size: 1.5rem; color: var(--text-main);">
              Order Items (${totals.itemCount})
            </h2>
            <button id="clearAllCartBtn" class="btn-outline btn-sm" style="color: var(--error); border-color: rgba(239, 68, 68, 0.3);">
              <span class="material-symbols-outlined" style="font-size:14px;">delete_sweep</span>
              <span>Clear Cart</span>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${cart.map((item, idx) => `
              <div class="hearth-card" style="padding: 1.25rem; display: flex; gap: 1.25rem; align-items: center; position: relative;">
                <img src="${item.image}" alt="${item.name}" style="width: 90px; height: 90px; border-radius: 6px; object-fit: cover; border: 1px solid var(--outline-hairline); flex-shrink: 0;">
                
                <div style="flex-grow: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.25rem;">
                    <h3 class="font-serif" style="font-size: 1.125rem; color: var(--text-main); font-weight: 600;">
                      ${item.name}
                    </h3>
                    <button class="cart-item-remove" data-idx="${idx}" style="color: var(--text-dim); padding: 4px;" title="Remove Item">
                      <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                    </button>
                  </div>

                  <div style="font-size: 0.8125rem; color: var(--primary); margin-bottom: 0.5rem;">
                    ${item.portion} ${item.addons && item.addons.length ? '• ' + item.addons.map(a => a.name).join(', ') : ''}
                  </div>

                  ${item.instructions ? `
                    <div style="font-size: 0.75rem; color: var(--text-dim); font-style: italic; margin-bottom: 0.5rem;">
                      "${item.instructions}"
                    </div>
                  ` : ''}

                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                    <div class="qty-stepper" style="height: 32px;">
                      <button class="qty-btn cart-qty-minus" data-idx="${idx}" style="width:32px; height:32px;">-</button>
                      <span class="qty-val" style="min-width:32px; font-size:0.875rem;">${item.quantity}</span>
                      <button class="qty-btn cart-qty-plus" data-idx="${idx}" style="width:32px; height:32px;">+</button>
                    </div>

                    <div style="text-align: right;">
                      <div style="font-size: 0.75rem; color: var(--text-dim);">${formatNPR(item.unitPrice)} each</div>
                      <div style="font-weight: 700; color: var(--primary); font-size: 1.125rem;">${formatNPR(item.total)}</div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 1.5rem;">
            <a href="menu.html" class="btn-outline btn-sm">
              <span class="material-symbols-outlined" style="font-size:16px;">arrow_back</span>
              <span>Continue Shopping</span>
            </a>
          </div>
        </div>

        <!-- Right: Order Summary & Coupon Card -->
        <div>
          <!-- Coupon Box -->
          <div class="hearth-card" style="padding: 1.5rem; margin-bottom: 1.5rem;">
            <h3 class="label-caps" style="color: var(--primary); margin-bottom: 0.75rem;">Apply Promotional Coupon</h3>
            
            ${totals.appliedCoupon ? `
              <div style="display:flex; justify-content:space-between; align-items:center; background: rgba(52, 211, 153, 0.1); border: 1px dashed var(--success); padding: 0.75rem 1rem; border-radius: 4px;">
                <div>
                  <div style="font-weight:700; color:var(--success); font-size:0.875rem;">CODE: ${totals.appliedCoupon.code}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${totals.appliedCoupon.description}</div>
                </div>
                <button id="removeCouponBtn" style="color:var(--error); font-size:0.75rem; font-weight:600; text-transform:uppercase;">
                  Remove
                </button>
              </div>
            ` : `
              <form id="couponApplyForm" style="display:flex; gap:0.5rem;">
                <input type="text" id="couponInput" class="form-control" placeholder="e.g. HEARTH10 or NAMASTE100" style="text-transform:uppercase; font-size:0.875rem;" required>
                <button type="submit" class="btn-primary btn-sm" style="white-space:nowrap;">Apply</button>
              </form>
              <div style="font-size:0.75rem; color:var(--text-dim); margin-top:0.6rem;">
                Available offers: <strong style="color:var(--primary);">HEARTH10</strong> (10% off &gt;Rs. 1000) • <strong style="color:var(--primary);">NAMASTE100</strong> (Rs. 100 off)
              </div>
            `}
          </div>

          <!-- Totals Card -->
          <div class="hearth-card" style="padding: 1.75rem;">
            <h3 class="font-serif" style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--outline-hairline);">
              Order Summary
            </h3>

            <div class="cart-summary-row">
              <span>Items Subtotal</span>
              <span style="color: var(--text-main); font-weight: 600;">${formatNPR(totals.subtotal)}</span>
            </div>

            ${totals.discount > 0 ? `
              <div class="cart-summary-row" style="color: var(--success);">
                <span>Promotional Discount</span>
                <span>-${formatNPR(totals.discount)}</span>
              </div>
            ` : ''}

            <div class="cart-summary-row">
              <div>
                <span>Valley Delivery</span>
                <div style="font-size:0.7rem; color:var(--text-dim);">Free on orders above Rs. 2,000</div>
              </div>
              <span>${totals.deliveryFee === 0 ? '<span style="color:var(--success); font-weight:700;">FREE</span>' : formatNPR(totals.deliveryFee)}</span>
            </div>

            <div class="cart-summary-row">
              <div>
                <span>Nepal VAT (13%)</span>
                <div style="font-size:0.7rem; color:var(--text-dim);">Government Statutory Tax</div>
              </div>
              <span style="color: var(--text-main);">${formatNPR(totals.vatTax)}</span>
            </div>

            <div class="cart-total-row" style="margin-top: 1rem; padding-top: 1rem;">
              <span>Total Payable</span>
              <span style="font-size: 1.35rem;">${formatNPR(totals.grandTotal)}</span>
            </div>

            <div style="margin-top: 1.75rem;">
              <a href="checkout.html" class="btn-primary" style="width: 100%; text-align: center; height: 50px; font-size: 0.8125rem;">
                <span>Proceed to Checkout</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>

            <div style="margin-top: 1rem; text-align: center; font-size: 0.75rem; color: var(--text-dim); display:flex; align-items:center; justify-content:center; gap:0.5rem;">
              <span class="material-symbols-outlined text-primary text-sm">verified_user</span>
              <span>Encrypted Checkout • Fresh Wood-Fired Preparation</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Event Listeners
    container.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        updateCartQuantity(idx, cart[idx].quantity + 1);
        renderCart();
        updateCartBadges();
      });
    });

    container.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        updateCartQuantity(idx, cart[idx].quantity - 1);
        renderCart();
        updateCartBadges();
      });
    });

    container.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        removeFromCart(idx);
        renderCart();
        updateCartBadges();
        showToast('Item removed from cart.');
      });
    });

    document.getElementById('clearAllCartBtn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        clearCart();
        renderCart();
        updateCartBadges();
        showToast('Cart cleared.');
      }
    });

    // Coupon listener
    const couponForm = document.getElementById('couponApplyForm');
    if (couponForm) {
      couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('couponInput')?.value;
        const res = applyCoupon(code);
        if (res.success) {
          showToast(res.message, 'success');
        } else {
          showToast(res.message, 'error');
        }
        renderCart();
      });
    }

    document.getElementById('removeCouponBtn')?.addEventListener('click', () => {
      removeCoupon();
      showToast('Coupon removed.');
      renderCart();
    });
  }

  renderCart();
}

if (document.getElementById('cartPageContainer')) {
  document.addEventListener('DOMContentLoaded', initCartPage);
}
