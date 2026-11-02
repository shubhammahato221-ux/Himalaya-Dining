/**
 * HIMALAYAN HEARTH — MENU CATALOG CONTROLLER
 * Handles Search, Category Filtering, Dietary Filters,
 * Sorting, Food Grid Rendering, and Quick Actions.
 */

import { getMenuItems, formatNPR, addToCart } from './storage.js';
import { openFoodDetailsModal, showToast, updateCartBadges } from './main.js';

let currentCategory = 'all';
let currentSearch = '';
let currentDietFilter = 'all'; // 'all', 'veg', 'nonveg'
let currentSort = 'default';

export function initMenuPage() {
  const grid = document.getElementById('menuDishesGrid');
  const countDisplay = document.getElementById('menuItemCount');
  const searchInput = document.getElementById('menuSearchInput');
  const filterButtons = document.querySelectorAll('.filter-pill');
  const dietFilterRadios = document.querySelectorAll('input[name="dietFilter"]');
  const sortSelect = document.getElementById('menuSortSelect');

  // Check URL query parameters for category
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    currentCategory = categoryParam;
    filterButtons.forEach(btn => {
      if (btn.getAttribute('data-category') === categoryParam) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function renderDishes() {
    let dishes = getMenuItems();

    // 1. Category Filter
    if (currentCategory !== 'all') {
      dishes = dishes.filter(d => d.category === currentCategory);
    }

    // 2. Dietary Filter
    if (currentDietFilter === 'veg') {
      dishes = dishes.filter(d => d.isVeg === true);
    } else if (currentDietFilter === 'nonveg') {
      dishes = dishes.filter(d => d.isVeg === false);
    }

    // 3. Search Filter
    if (currentSearch.trim() !== '') {
      const q = currentSearch.toLowerCase().trim();
      dishes = dishes.filter(d => 
        d.name.toLowerCase().includes(q) || 
        (d.nepaliName && d.nepaliName.includes(q)) ||
        d.description.toLowerCase().includes(q)
      );
    }

    // 4. Sort
    if (currentSort === 'price-asc') {
      dishes.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      dishes.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name-asc') {
      dishes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'popular') {
      dishes.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    if (countDisplay) {
      countDisplay.textContent = `${dishes.length} artisanal dishes found`;
    }

    if (!grid) return;

    if (dishes.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <span class="material-symbols-outlined" style="font-size: 3.5rem; color: var(--text-dim); margin-bottom: 1rem;">search_off</span>
          <h3 class="font-serif" style="font-size: 1.25rem; color: var(--text-main); margin-bottom: 0.5rem;">No Dishes Found</h3>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">Try modifying your search or resetting dietary filters.</p>
          <button id="resetMenuFiltersBtn" class="btn-primary btn-sm">Reset All Filters</button>
        </div>
      `;
      document.getElementById('resetMenuFiltersBtn')?.addEventListener('click', () => {
        currentCategory = 'all';
        currentSearch = '';
        currentDietFilter = 'all';
        currentSort = 'default';
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'default';
        filterButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === 'all'));
        dietFilterRadios.forEach(r => r.checked = r.value === 'all');
        renderDishes();
      });
      return;
    }

    grid.innerHTML = dishes.map(dish => `
      <div class="hearth-card food-card" data-dish-id="${dish.id}">
        <div class="food-card-img-wrap" style="cursor: pointer;" onclick="window.openDishModal('${dish.id}')">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy">
          <span class="${dish.isVeg ? 'badge-veg' : 'badge-nonveg'}">
            <span style="font-size:8px;">●</span> ${dish.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
          ${dish.isChefSpecial ? `<span class="food-badge" style="background:rgba(123,47,13,0.9); border-color:var(--on-secondary-container); color:var(--on-secondary-container);">Chef Special</span>` : (dish.isPopular ? `<span class="food-badge">Popular</span>` : '')}
        </div>
        <div class="food-card-body">
          <div class="food-card-header">
            <h3 class="food-title" style="cursor:pointer;" onclick="window.openDishModal('${dish.id}')">${dish.name}</h3>
            <div class="food-price">${formatNPR(dish.price)}</div>
          </div>
          <div style="font-size: 0.75rem; color: var(--primary); font-family: var(--font-serif); margin-bottom: 0.35rem;">
            ${dish.nepaliName || ''}
          </div>
          <p class="food-desc">${dish.description}</p>
          <div class="food-card-footer">
            <div style="font-size: 0.75rem; color: var(--text-dim); display:flex; align-items:center; gap:4px;">
              <span class="material-symbols-outlined" style="font-size:15px; color:var(--primary);">local_fire_department</span>
              <span>${dish.spiceLevel || 'Chef Curated'}</span>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn-outline btn-sm quick-view-btn" data-id="${dish.id}">
                Details
              </button>
              <button class="btn-primary btn-sm quick-add-btn" data-id="${dish.id}" ${!dish.available ? 'disabled style="opacity:0.5;"' : ''}>
                ${dish.available ? '+ Add' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Click Events
    grid.querySelectorAll('.quick-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openFoodDetailsModal(btn.getAttribute('data-id'));
      });
    });

    grid.querySelectorAll('.quick-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const dish = dishes.find(d => d.id === id);
        if (dish && dish.available) {
          addToCart(dish, 1);
          updateCartBadges();
          showToast(`Added ${dish.name} to cart!`, 'success');
        }
      });
    });
  }

  // Global helper for onclick
  window.openDishModal = (id) => openFoodDetailsModal(id);

  // Category buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderDishes();
    });
  });

  // Search input with debounce
  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentSearch = e.target.value;
        renderDishes();
      }, 200);
    });
  }

  // Dietary radio filters
  dietFilterRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentDietFilter = e.target.value;
      renderDishes();
    });
  });

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderDishes();
    });
  }

  // Initial Render
  renderDishes();
}

// Auto-run if on menu page
if (document.getElementById('menuDishesGrid')) {
  document.addEventListener('DOMContentLoaded', initMenuPage);
}
