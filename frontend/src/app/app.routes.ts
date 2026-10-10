import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products';
import { Cart } from './cart/cart';

export const routes: Routes = [
    { path: '', component: ProductsComponent },
    { path: 'cart', component: Cart }
];
