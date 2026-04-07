/**
 * search.js
 * Search and filter logic
 */
import { debounce } from '../main.js';

export function initSearch() {
  const searchInput = document.querySelector('.search-input');
  const filterGrid = document.querySelector('.filter-grid');
  const items = document.querySelectorAll('.filter-item');

  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      const query = e.target.value.toLowerCase();
      
      items.forEach(item => {
        const title = item.getAttribute('data-title') || '';
        if (title.toLowerCase().includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }, 300));
  }
}
