
import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly storageKey = 'shopcart-cart';

  readonly cartState = signal<CartItem[]>(this.loadCart());

  readonly items = this.cartState.asReadonly();

  readonly itemCount = computed(() =>
    this.cartState().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.cartState().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );

  add(product: Product): boolean {
    if (product.stock <= 0) {
      return false;
    }

    const currentItems = this.cartState();
    const existing = currentItems.find(
      item => item.product._id === product._id
    );

    if (existing && existing.quantity >= product.stock) {
      return false;
    }

    if (existing) {
      this.cartState.set(
        currentItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.cartState.set([
        ...currentItems,
        { product, quantity: 1 },
      ]);
    }

    this.saveCart();
    return true;
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartState().find(
      entry => entry.product._id === productId
    );

    if (!item) return;

    if (quantity <= 0) {
      this.remove(productId);
      return;
    }

    const safeQuantity = Math.min(quantity, item.product.stock);

    this.cartState.update(items =>
      items.map(entry =>
        entry.product._id === productId
          ? { ...entry, quantity: safeQuantity }
          : entry
      )
    );

    this.saveCart();
  }

  remove(productId: string): void {
    this.cartState.update(items =>
      items.filter(item => item.product._id !== productId)
    );

    this.saveCart();
  }

  clear(): void {
    this.cartState.set([]);
    this.saveCart();
  }

  private loadCart(): CartItem[] {
    try {
      if (typeof localStorage === 'undefined') return [];

      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) as CartItem[] : [];
    } catch {
      return [];
    }
  }

  private saveCart(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify(this.cartState())
        );
      }
    } catch (error) {
      console.error('Could not save cart:', error);
    }
  }
}
