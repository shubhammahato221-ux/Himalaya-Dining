/**
 * HIMALAYAN HEARTH — FOOD DETAILS PAGE CONTROLLER
 * Loads dish details based on URL query parameter `?id=...`
 * Supports portion selection, add-on options, dynamic pricing, and add to cart.
 */

import { getMenuItemById, formatNPR, addToCart, getMenuItems } from './storage.js';
import { updateCartBadges, showToast, openCartDrawer } from './main.js';

export function initFoodDetailsPage() {
  const container = document.getElementById('foodDetailsContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  let dishId = urlParams.get('id');

  // Fallback if no ID passed: pick the first signature dish
  if (!dishId) {
    const all = getMenuItems();
    dishId = all[0]?.id || 'kothey-truffle-momo';
  }

  const dish = getMenuItemById(dishId);
  if (!dish) {
    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 1rem;">
        <h2 class="font-serif" style="font-size: 1.75rem; color: var(--text-main); margin-bottom: 1rem;">Dish Not Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">The selected culinary masterpiece could not be located.</p>
        <a href="menu.html" class="btn-primary">Browse All Dishes</a>
      </div>
    `;
    return;
  }

  // Update page title
  document.title = `${dish.name} | Himalayan Hearth`;

  let currentPortion = dish.portions ? dish.portions[0] : { name: 'Regular', priceMod: 0 };
  let selectedAddons = [];
  let quantity = 1;

  function calculateTotal() {
    const base = dish.price + currentPortion.priceMod;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return (base + addonsTotal) * quantity;
  }

  function renderPage() {
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 3.5rem; align-items: start;">
        <!-- Left: Dish Photography & Gallery Badges -->
        <div>
          <div style="position: relative; border-radius: 8px; overflow: hidden; border: 1px solid var(--outline-hairline); box-shadow: var(--shadow-card); height: 460px; background: var(--surface);">
            <img src="${dish.image}" alt="${dish.name}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; top: 16px; left: 16px;">
              <span class="${dish.isVeg ? 'badge-veg' : 'badge-nonveg'}" style="position:static; padding:4px 10px; font-size:0.75rem;">
                <span style="font-size:9px;">●</span> ${dish.isVeg ? 'PURE VEGETARIAN' : 'NON-VEGETARIAN'}
              </span>
            </div>
            ${dish.isChefSpecial ? `
              <div style="position: absolute; top: 16px; right: 16px;">
                <span class="food-badge" style="position:static; background:rgba(123,47,13,0.95); color:var(--on-secondary-container); border-color:var(--on-secondary-container);">
                  Chef Special
                </span>
              </div>
            ` : ''}
          </div>

          <div style="margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--surface-container); border: 1px solid var(--outline-hairline); border-radius: 6px;">
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.8125rem; color:var(--text-dim);">
              <span class="material-symbols-outlined text-primary">schedule</span>
              <span>Prep Time: ${dish.prepTime || '20-25 mins'}</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.8125rem; color:var(--text-dim);">
              <span class="material-symbols-outlined text-primary">local_fire_department</span>
              <span>Spice: ${dish.spiceLevel || 'Chef Curated'}</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.8125rem; color:var(--text-dim);">
              <span class="material-symbols-outlined text-primary">verified</span>
              <span>Rating: ${dish.rating} (${dish.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <!-- Right: Dish Details, Options & Order Action -->
        <div>
          <div style="margin-bottom: 0.5rem;">
            <span class="label-caps" style="color: var(--primary);">${dish.categoryName || 'Culinary Masterpiece'}</span>
          </div>
          <h1 class="font-serif" style="font-size: 2.25rem; color: var(--text-main); font-weight: 700; line-height: 1.2; margin-bottom: 0.25rem;">
            ${dish.name}
          </h1>
          <div style="font-size: 1.125rem; color: var(--primary); font-family: var(--font-serif); margin-bottom: 1rem;">
            ${dish.nepaliName || ''}
          </div>

          <div style="font-size: 1.75rem; font-weight: 700; color: var(--primary); margin-bottom: 1.5rem;">
            ${formatNPR(dish.price)}
          </div>

          <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 2rem;">
            ${dish.description}
          </p>

          <!-- Portion Sizes -->
          ${dish.portions && dish.portions.length > 1 ? `
          <div style="margin-bottom: 1.75rem;">
            <label class="form-label" style="display:block; margin-bottom:0.75rem;">1. Select Serving Size</label>
            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              ${dish.portions.map((p, idx) => `
                <label style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 1.25rem; border:1px solid ${currentPortion.name === p.name ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${currentPortion.name === p.name ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <input type="radio" name="portionRadio" value="${idx}" ${currentPortion.name === p.name ? 'checked' : ''} style="accent-color:var(--primary);">
                    <span style="font-weight:600; color:var(--text-main); font-size:0.9375rem;">${p.name}</span>
                  </div>
                  <span style="color:var(--primary); font-weight:600; font-size:0.875rem;">
                    ${p.priceMod > 0 ? '+' + formatNPR(p.priceMod) : 'Standard Price'}
                  </span>
                </label>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Addons -->
          ${dish.addons && dish.addons.length > 0 ? `
          <div style="margin-bottom: 1.75rem;">
            <label class="form-label" style="display:block; margin-bottom:0.75rem;">2. Complementary Add-ons & Accompaniments</label>
            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              ${dish.addons.map((a, idx) => {
                const isChecked = selectedAddons.some(sel => sel.name === a.name);
                return `
                <label style="display:flex; justify-content:space-between; align-items:center; padding:0.85rem 1.25rem; border:1px solid ${isChecked ? 'var(--primary)' : 'var(--outline-hairline)'}; border-radius:4px; cursor:pointer; background:${isChecked ? 'rgba(249,187,97,0.06)' : 'var(--surface)'};">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <input type="checkbox" class="detail-addon-cb" data-idx="${idx}" ${isChecked ? 'checked' : ''} style="accent-color:var(--primary);">
                    <span style="color:var(--text-main); font-size:0.9375rem;">${a.name}</span>
                  </div>
                  <span style="color:var(--primary); font-weight:600; font-size:0.875rem;">+${formatNPR(a.price)}</span>
                </label>
                `;
              }).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Special Request Field -->
          <div style="margin-bottom: 2rem;">
            <label class="form-label" for="detailSpecialNote" style="display:block; margin-bottom:0.5rem;">3. Chef Notes & Dietary Instructions</label>
            <textarea id="detailSpecialNote" class="form-control" rows="2" placeholder="Tell our kitchen about any specific spicing preferences or allergy notes..."></textarea>
          </div>

          <!-- Quantity Stepper & Add Button -->
          <div style="display: flex; gap: 1.25rem; align-items: center; padding-top: 1.5rem; border-top: 1px solid var(--outline-hairline);">
            <div class="qty-stepper" style="height: 48px;">
              <button class="qty-btn" id="detailQtyMinus" style="width:48px; height:48px; font-size:1.125rem;">-</button>
              <span class="qty-val" id="detailQtyVal" style="min-width:48px; font-size:1.125rem;">${quantity}</span>
              <button class="qty-btn" id="detailQtyPlus" style="width:48px; height:48px; font-size:1.125rem;">+</button>
            </div>
            
            <button class="btn-primary" id="detailAddToCartBtn" style="flex-grow:1; height:48px; font-size:0.8125rem;">
              <span class="material-symbols-outlined text-base">shopping_bag</span>
              <span>Add to Cart</span>
              <span id="detailPayableDisplay">• ${formatNPR(calculateTotal())}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Portion Radio Events
    container.querySelectorAll('input[name="portionRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value);
        currentPortion = dish.portions[idx];
        renderPage();
      });
    });

    // Addons Checkbox Events
    container.querySelectorAll('.detail-addon-cb').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const idx = parseInt(cb.getAttribute('data-idx'));
        const addon = dish.addons[idx];
        if (cb.checked) {
          selectedAddons.push(addon);
        } else {
          selectedAddons = selectedAddons.filter(a => a.name !== addon.name);
        }
        document.getElementById('detailPayableDisplay').textContent = '• ' + formatNPR(calculateTotal());
      });
    });

    // Quantity events
    container.querySelector('#detailQtyPlus').addEventListener('click', () => {
      quantity++;
      document.getElementById('detailQtyVal').textContent = quantity;
      document.getElementById('detailPayableDisplay').textContent = '• ' + formatNPR(calculateTotal());
    });

    container.querySelector('#detailQtyMinus').addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        document.getElementById('detailQtyVal').textContent = quantity;
        document.getElementById('detailPayableDisplay').textContent = '• ' + formatNPR(calculateTotal());
      }
    });

    // Add to Cart
    container.querySelector('#detailAddToCartBtn').addEventListener('click', () => {
      const instructions = document.getElementById('detailSpecialNote')?.value || '';
      addToCart(dish, quantity, {
        portion: currentPortion.name,
        portionPriceMod: currentPortion.priceMod,
        addons: selectedAddons,
        instructions: instructions
      });
      updateCartBadges();
      showToast(`Added ${dish.name} (${quantity}) to cart!`, 'success');
      openCartDrawer();
    });
  }

  renderPage();
}

if (document.getElementById('foodDetailsContainer')) {
  document.addEventListener('DOMContentLoaded', initFoodDetailsPage);
}
