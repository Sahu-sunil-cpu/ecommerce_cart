
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    featured: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductsResponse {
    success: boolean;
    count: number;
    data: Product[];
}

export interface ProductResponse {
    success: boolean;
    data: Product;
}
