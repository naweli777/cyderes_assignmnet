export interface Product {
    id:          number;
    title:       string;
    slug:        string;
    price:       number;
    description: string;
    category:    Category;
    images:      string[];
    creationAt:  Date;
    updatedAt:   Date;
}

export interface Category {
    id:         number;
    name:       Name;
    slug:       Slug;
    image:      string;
    creationAt: Date;
    updatedAt:  Date;
}

export enum Name {
    Clothes = "Clothes",
    Furniture = "Furniture",
    Miscellaneous = "Miscellaneous",
    Shoes = "Shoes",
    Tech = "Tech",
}

export enum Slug {
    Clothes = "clothes",
    Furniture = "furniture",
    Miscellaneous = "miscellaneous",
    Shoes = "shoes",
    Tech = "tech",
}
