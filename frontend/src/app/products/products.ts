
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../models/product';
import { ProductService } from '../services/product';

import { CartService } from '../services/cart';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  cartService = inject(CartService);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');
  search = signal('');
  selectedCategory = signal('All');
  sortBy = signal('featured');

  categories = computed(() => [
    'All',
    ...new Set(this.products().map(product => product.category))
  ]);

  filteredProducts = computed(() => {
    let result = this.products();

    const searchTerm = this.search().trim().toLowerCase();

    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (this.selectedCategory() !== 'All') {
      result = result.filter(
        product => product.category === this.selectedCategory()
      );
    }

    switch (this.sortBy()) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result = [...result].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
    }

    return result;
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    this.productService.getProducts().subscribe({
      next: products => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: err => {
        console.error('Unable to load products:', err);
        this.error.set(
          'We could not load products. Please check that the API is running.'
        );
        this.loading.set(false);
      }
    });
  }

  setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  setSort(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  addToCart(product: Product): void {
    const added = this.cartService.add(product);

    if (added) {
      console.log(`${product.name} added to cart`);
    } else {
      console.log('Product is out of stock or maximum quantity reached');
    }
  }


}
