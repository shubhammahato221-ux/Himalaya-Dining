/**
 * HIMALAYAN HEARTH — CHECKOUT CONTROLLER
 * Validates Nepal-specific customer address, handles delivery zone checks,
 * supports Nepali payment methods (COD, eSewa, Khalti, Fonepay QR, Bank Transfer),
 * generates order, and routes to confirmation.
 */

import { 
  getCart, 
  calculateCartTotals, 
  formatNPR, 
  createOrder, 
  getCurrentUser 
} from './storage.js';
import { showToast } from './main.js';

export function initCheckoutPage() {
  const container = document.getElementById('checkoutPageContainer');
  if (!container) return;

  const cart = getCart();
  if (!cart || cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 1rem; max-width: 500px; margin: 0 auto;">
        <span class="material-symbols-outlined" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">remove_shopping_cart</span>
        <h2 class="font-serif" style="font-size: 1.75rem; color: var(--text-main); margin-bottom: 0.75rem;">Your Cart is Empty</h2>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.75rem;">Please select delicious items from our menu before proceeding to checkout.</p>
        <a href="menu.html" class="btn-primary">Browse Menu</a>
      </div>
    `;
    return;
  }

  const totals = calculateCartTotals();
  const currentUser = getCurrentUser();

  let selectedOrderType = 'delivery'; // 'delivery' or 'pickup'
  let selectedPaymentMethod = 'cod'; // 'cod', 'esewa', 'khalti', 'fonepay', 'bank'

  function renderCheckout() {
    container.innerHTML = `
      <div class="checkout-layout">
        <!-- Left: Customer Details, Delivery & Payment -->
        <div>
          <form id="orderCheckoutForm" novalidate>
            <!-- 1. Order Type Switcher -->
            <div class="hearth-card" style="padding: 1.5rem; margin-bottom: 1.75rem;">
              <span class="label-caps" style="color:var(--primary); display:block; margin-bottom:0.75rem;">1. Fulfillment Method</span>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid ${selectedOrderType === 'delivery' ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius: 4px; cursor: pointer; background: ${selectedOrderType === 'delivery' ? 'rgba(249,187,97,0.08)' : 'var(--surface)'};">
                  <input type="radio" name="orderType" value="delivery" ${selectedOrderType === 'delivery' ? 'checked' : ''} style="accent-color: var(--primary);">
                  <div>
                    <div style="font-weight: 600; color: var(--text-main); font-size: 0.9375rem;">Valley Home Delivery</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">Delivered in 35-45 minutes</div>
                  </div>
                </label>

                <label style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid ${selectedOrderType === 'pickup' ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius: 4px; cursor: pointer; background: ${selectedOrderType === 'pickup' ? 'rgba(249,187,97,0.08)' : 'var(--surface)'};">
                  <input type="radio" name="orderType" value="pickup" ${selectedOrderType === 'pickup' ? 'checked' : ''} style="accent-color: var(--primary);">
                  <div>
                    <div style="font-weight: 600; color: var(--text-main); font-size: 0.9375rem;">Restaurant Pickup</div>
                    <div style="font-size: 0.75rem; color: var(--text-dim);">Durbar Marg Sanctuary (20 mins)</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- 2. Customer & Address Details -->
            <div class="hearth-card" style="padding: 1.75rem; margin-bottom: 1.75rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
                <span class="label-caps" style="color:var(--primary);">2. Contact & Delivery Information</span>
                <span style="font-size:0.75rem; color:var(--text-dim);">Country: Nepal</span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label" for="custFullName">Full Name *</label>
                  <input type="text" id="custFullName" class="form-control" value="${currentUser?.name || ''}" placeholder="e.g. Maya Shrestha" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="custPhone">Nepal Mobile Number *</label>
                  <input type="tel" id="custPhone" class="form-control" value="${currentUser?.phone || '+977 '}" placeholder="+977 9801234567" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="custEmail">Email Address (Optional)</label>
                <input type="email" id="custEmail" class="form-control" value="${currentUser?.email || ''}" placeholder="For receipt dispatch">
              </div>

              ${selectedOrderType === 'delivery' ? `
              <!-- Delivery Address Fields -->
              <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--outline-hairline);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label" for="custProvince">Province</label>
                    <select id="custProvince" class="form-control">
                      <option value="Bagmati Province" selected>Bagmati Province</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="custDistrict">District *</label>
                    <select id="custDistrict" class="form-control" required>
                      <option value="Kathmandu" selected>Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="custArea">Valley Delivery Area / Neighborhood *</label>
                  <select id="custArea" class="form-control" required>
                    <option value="Durbar Marg / Lazimpat" selected>Durbar Marg / Lazimpat (15-25 min)</option>
                    <option value="Thamel / Chhetrapati">Thamel / Chhetrapati (20-30 min)</option>
                    <option value="New Baneshwor / Minbhawan">New Baneshwor / Minbhawan (30-40 min)</option>
                    <option value="Old Baneshwor / Sinamangal">Old Baneshwor / Sinamangal (30-40 min)</option>
                    <option value="Koteshwor / Narephate / Jadibuti">Koteshwor / Narephate / Jadibuti (35-45 min)</option>
                    <option value="Baluwatar / Maharajgunj / Golfutar">Baluwatar / Maharajgunj / Golfutar (25-35 min)</option>
                    <option value="Patan / Jawalakhel / Kupondole">Patan / Jawalakhel / Kupondole (30-40 min)</option>
                    <option value="Jhamsikhel / Sanepa / Pulchowk">Jhamsikhel / Sanepa / Pulchowk (30-40 min)</option>
                    <option value="Boudha / Chabahil / Jorpati">Boudha / Chabahil / Jorpati (35-45 min)</option>
                    <option value="Thimi / Sallaghari (Bhaktapur)">Thimi / Sallaghari (Bhaktapur) (40-50 min)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="custStreet">Street Address & House / Apartment No. *</label>
                  <input type="text" id="custStreet" class="form-control" value="${currentUser?.address || ''}" placeholder="e.g. House #14, Heritage Lane, Ward 1" required>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label" for="custLandmark">Nearest Landmark *</label>
                    <input type="text" id="custLandmark" class="form-control" placeholder="e.g. Opposite Bhatbhateni, Near Sunrise Bank" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="custInstructions">Rider Instructions</label>
                    <input type="text" id="custInstructions" class="form-control" placeholder="e.g. Ring gate bell, call upon arrival">
                  </div>
                </div>
              </div>
              ` : `
              <div style="background: var(--surface); border: 1px solid var(--outline-hairline); border-radius: 4px; padding: 1rem; margin-top: 1rem;">
                <div style="font-weight: 600; color: var(--primary); margin-bottom: 0.25rem;">Pickup Location:</div>
                <div style="font-size: 0.875rem; color: var(--text-main);">Himalayan Hearth Kitchen Sanctuary</div>
                <div style="font-size: 0.8125rem; color: var(--text-muted);">Durbar Marg Heritage Quarter, Kathmandu 44600 (Next to Narayanhiti Gate)</div>
                <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.25rem;">Contact: +977 1 4412345</div>
              </div>
              `}
            </div>

            <!-- 3. Payment Methods for Nepal -->
            <div class="hearth-card" style="padding: 1.75rem; margin-bottom: 1.75rem;">
              <span class="label-caps" style="color:var(--primary); display:block; margin-bottom:1rem;">3. Select Payment Method (Nepal)</span>
              
              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                <!-- Cash on Delivery -->
                <label style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border:1px solid ${selectedPaymentMethod === 'cod' ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${selectedPaymentMethod === 'cod' ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.85rem;">
                    <input type="radio" name="paymentOption" value="cod" ${selectedPaymentMethod === 'cod' ? 'checked' : ''} style="accent-color:var(--primary);">
                    <div>
                      <div style="font-weight:600; color:var(--text-main); font-size:0.9375rem;">Cash on Delivery (COD)</div>
                      <div style="font-size:0.75rem; color:var(--text-dim);">Pay in cash or local QR when food arrives at your door</div>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-primary">payments</span>
                </label>

                <!-- eSewa -->
                <label style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border:1px solid ${selectedPaymentMethod === 'esewa' ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${selectedPaymentMethod === 'esewa' ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.85rem;">
                    <input type="radio" name="paymentOption" value="esewa" ${selectedPaymentMethod === 'esewa' ? 'checked' : ''} style="accent-color:var(--primary);">
                    <div>
                      <div style="font-weight:600; color:var(--text-main); font-size:0.9375rem;">eSewa Mobile Wallet</div>
                      <div style="font-size:0.75rem; color:var(--text-dim);">Nepal's #1 digital wallet • Direct wallet payment</div>
                    </div>
                  </div>
                  <span style="background:#60bb46; color:#fff; font-weight:800; font-size:0.7rem; padding:2px 8px; border-radius:3px;">eSewa</span>
                </label>

                <!-- Khalti -->
                <label style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border:1px solid ${selectedPaymentMethod === 'khalti' ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${selectedPaymentMethod === 'khalti' ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.85rem;">
                    <input type="radio" name="paymentOption" value="khalti" ${selectedPaymentMethod === 'khalti' ? 'checked' : ''} style="accent-color:var(--primary);">
                    <div>
                      <div style="font-weight:600; color:var(--text-main); font-size:0.9375rem;">Khalti Digital Wallet</div>
                      <div style="font-size:0.75rem; color:var(--text-dim);">Instant wallet checkout with OTP verification</div>
                    </div>
                  </div>
                  <span style="background:#5c2d91; color:#fff; font-weight:800; font-size:0.7rem; padding:2px 8px; border-radius:3px;">Khalti</span>
                </label>

                <!-- Fonepay QR -->
                <label style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border:1px solid ${selectedPaymentMethod === 'fonepay' ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${selectedPaymentMethod === 'fonepay' ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.85rem;">
                    <input type="radio" name="paymentOption" value="fonepay" ${selectedPaymentMethod === 'fonepay' ? 'checked' : ''} style="accent-color:var(--primary);">
                    <div>
                      <div style="font-weight:600; color:var(--text-main); font-size:0.9375rem;">Fonepay QR / Mobile Banking</div>
                      <div style="font-size:0.75rem; color:var(--text-dim);">Scan to Pay with any Nepal banking app</div>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-primary">qr_code_2</span>
                </label>

                <!-- Bank Transfer -->
                <label style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border:1px solid ${selectedPaymentMethod === 'bank' ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${selectedPaymentMethod === 'bank' ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.85rem;">
                    <input type="radio" name="paymentOption" value="bank" ${selectedPaymentMethod === 'bank' ? 'checked' : ''} style="accent-color:var(--primary);">
                    <div>
                      <div style="font-weight:600; color:var(--text-main); font-size:0.9375rem;">Direct Bank Transfer (HBL / Nabil)</div>
                      <div style="font-size:0.75rem; color:var(--text-dim);">Himalayan Bank Ltd • Instant corporate account transfer</div>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-primary">account_balance</span>
                </label>
              </div>

              <!-- Payment Details Display -->
              <div id="paymentInstructionsBox" style="margin-top: 1rem; padding: 1rem; background: var(--surface); border: 1px dashed var(--outline-hairline); border-radius: 4px; font-size: 0.8125rem;">
                ${getPaymentNote(selectedPaymentMethod, totals.grandTotal)}
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="placeOrderSubmitBtn" class="btn-primary" style="width: 100%; height: 52px; font-size: 0.875rem;">
              <span>Confirm & Place Order</span>
              <span>• ${formatNPR(totals.grandTotal)}</span>
            </button>
          </form>
        </div>

        <!-- Right: Order Summary Breakdown -->
        <div>
          <div class="hearth-card" style="padding: 1.75rem; position: sticky; top: 100px;">
            <h3 class="font-serif" style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--outline-hairline);">
              Your Order Review
            </h3>

            <div style="max-height: 240px; overflow-y: auto; margin-bottom: 1.25rem; display:flex; flex-direction:column; gap:0.75rem;">
              ${cart.map(item => `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.875rem;">
                  <div>
                    <div style="color:var(--text-main); font-weight:600;">${item.name} × ${item.quantity}</div>
                    <div style="font-size:0.75rem; color:var(--text-dim);">${item.portion}</div>
                  </div>
                  <div style="font-weight:600; color:var(--primary);">${formatNPR(item.total)}</div>
                </div>
              `).join('')}
            </div>

            <div class="cart-summary-row">
              <span>Items Subtotal</span>
              <span style="color:var(--text-main); font-weight:600;">${formatNPR(totals.subtotal)}</span>
            </div>

            ${totals.discount > 0 ? `
              <div class="cart-summary-row" style="color: var(--success);">
                <span>Promotional Discount (${totals.appliedCoupon.code})</span>
                <span>-${formatNPR(totals.discount)}</span>
              </div>
            ` : ''}

            <div class="cart-summary-row">
              <span>Delivery Fee (${selectedOrderType === 'pickup' ? 'Pickup' : 'Kathmandu Valley'})</span>
              <span>${selectedOrderType === 'pickup' || totals.deliveryFee === 0 ? '<span style="color:var(--success); font-weight:700;">FREE</span>' : formatNPR(totals.deliveryFee)}</span>
            </div>

            <div class="cart-summary-row">
              <span>Statutory VAT (13%)</span>
              <span style="color:var(--text-main);">${formatNPR(totals.vatTax)}</span>
            </div>

            <div class="cart-total-row">
              <span>Final Total</span>
              <span style="font-size:1.4rem;">${formatNPR(selectedOrderType === 'pickup' ? totals.subtotal - totals.discount + totals.vatTax : totals.grandTotal)}</span>
            </div>

            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--outline-hairline); padding: 0.85rem; border-radius: 4px; font-size: 0.75rem; color: var(--text-dim);">
              <div style="display:flex; align-items:center; gap:0.5rem; color:var(--primary); font-weight:600; margin-bottom:0.25rem;">
                <span class="material-symbols-outlined text-sm">schedule</span>
                <span>Estimated Time:</span>
              </div>
              <div>${selectedOrderType === 'pickup' ? 'Ready for pickup in 20 minutes' : '35-45 minutes to your doorstep in Kathmandu Valley'}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Radio Listeners
    container.querySelectorAll('input[name="orderType"]').forEach(r => {
      r.addEventListener('change', (e) => {
        selectedOrderType = e.target.value;
        renderCheckout();
      });
    });

    container.querySelectorAll('input[name="paymentOption"]').forEach(r => {
      r.addEventListener('change', (e) => {
        selectedPaymentMethod = e.target.value;
        const box = document.getElementById('paymentInstructionsBox');
        if (box) box.innerHTML = getPaymentNote(selectedPaymentMethod, totals.grandTotal);
      });
    });

    // Form Submit Handler
    const form = document.getElementById('orderCheckoutForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
      });
    }
  }

  function getPaymentNote(method, total) {
    if (method === 'cod') {
      return `<strong>Cash on Delivery:</strong> Please keep exact cash of ${formatNPR(total)} ready upon delivery. Our rider also carries a Fonepay QR stand.`;
    } else if (method === 'esewa') {
      return `<strong>eSewa Payment:</strong> Merchant ID: <strong>HIMALAYAN_HEARTH</strong>. Your order will be verified instantly upon confirmation.`;
    } else if (method === 'khalti') {
      return `<strong>Khalti Wallet:</strong> Registered Khalti Mobile: <strong>+977 9801234567</strong>. Fast 1-click confirmation enabled.`;
    } else if (method === 'fonepay') {
      return `<strong>Fonepay QR:</strong> Scan to pay with any supported Nepali banking app (Nabil, Global IME, NIC Asia, Siddhartha, etc.).`;
    } else if (method === 'bank') {
      return `<strong>Bank Transfer:</strong> Account: Himalayan Hearth Pvt. Ltd. | Himalayan Bank Ltd | A/C: 0190284729101 | Branch: Durbar Marg.`;
    }
    return '';
  }

  function handleFormSubmit() {
    const name = document.getElementById('custFullName')?.value?.trim();
    const phone = document.getElementById('custPhone')?.value?.trim();
    const email = document.getElementById('custEmail')?.value?.trim();

    if (!name) {
      showToast('Please enter your full name.', 'error');
      document.getElementById('custFullName')?.focus();
      return;
    }

    if (!phone || phone.length < 9) {
      showToast('Please provide a valid Nepal contact number (+977 98xxxxxxxx).', 'error');
      document.getElementById('custPhone')?.focus();
      return;
    }

    let addressData = {};
    if (selectedOrderType === 'delivery') {
      const district = document.getElementById('custDistrict')?.value;
      const area = document.getElementById('custArea')?.value;
      const street = document.getElementById('custStreet')?.value?.trim();
      const landmark = document.getElementById('custLandmark')?.value?.trim();
      const instructions = document.getElementById('custInstructions')?.value?.trim();

      if (!street) {
        showToast('Please provide your street address.', 'error');
        document.getElementById('custStreet')?.focus();
        return;
      }
      if (!landmark) {
        showToast('Please specify a nearby landmark for the delivery rider.', 'error');
        document.getElementById('custLandmark')?.focus();
        return;
      }

      addressData = {
        province: 'Bagmati Province',
        district,
        area,
        street,
        landmark,
        instructions
      };
    } else {
      addressData = {
        pickupLocation: 'Durbar Marg Heritage Quarter, Kathmandu 44600'
      };
    }

    const submitBtn = document.getElementById('placeOrderSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined text-base" style="animation: spin 1s infinite linear;">sync</span>
        <span>Submitting to Himalayan Hearth Kitchen...</span>
      `;
    }

    // Determine final payment status
    let paymentStatus = selectedPaymentMethod === 'cod' ? 'Pending on Delivery' : 'Verified & Paid';

    // Build order object
    const finalDeliveryFee = selectedOrderType === 'pickup' ? 0 : totals.deliveryFee;
    const finalTotal = totals.subtotal - totals.discount + finalDeliveryFee + totals.vatTax;

    const orderPayload = {
      orderType: selectedOrderType,
      customer: {
        name,
        phone,
        email,
        ...addressData
      },
      items: cart,
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponCode: totals.appliedCoupon ? totals.appliedCoupon.code : null,
      deliveryFee: finalDeliveryFee,
      vatTax: totals.vatTax,
      total: finalTotal,
      paymentMethod: selectedPaymentMethod.toUpperCase(),
      paymentStatus: paymentStatus
    };

    setTimeout(() => {
      const savedOrder = createOrder(orderPayload);
      showToast(`Order #${savedOrder.id} successfully placed!`, 'success');
      window.location.href = `order-confirmation.html?orderId=${savedOrder.id}`;
    }, 1000);
  }

  renderCheckout();
}

if (document.getElementById('checkoutPageContainer')) {
  document.addEventListener('DOMContentLoaded', initCheckoutPage);
}
