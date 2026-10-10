import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);

  increase(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  decrease(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity - 1);
  }

  remove(productId: string): void {
    this.cartService.remove(productId);
  }
}
