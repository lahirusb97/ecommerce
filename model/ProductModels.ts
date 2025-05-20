export interface ProductVariantOptionModel {
  optionId: string;
  optionName: string;
  valueId: string;
  value: string;
}

export interface ProductVariantModel {
  id: string;
  productId: string;
  sku: string;
  price: string;
  stockQty: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  values: {
    id: string;
    variantId: string;
    optionId: string;
    valueId: string;
    option: {
      id: string;
      name: string;
    };
    value: {
      id: string;
      optionId: string;
      value: string;
    };
  }[];
  options: ProductVariantOptionModel[];
}

export interface ProductModel {
  id: string;
  slug: string;
  name: string;
  description?: string;
  categoryId: string;
  brandId?: string | null;
  createdAt: string;
  updatedAt: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  category?: {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
    createdAt: string;
    updatedAt: string;
    status: string;
  } | null;
  productCategories: {
    productId: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
      slug: string;
      parentId?: string | null;
      createdAt: string;
      updatedAt: string;
      status: string;
    };
  }[];
  variants: ProductVariantModel[];
  categories: {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
    createdAt: string;
    updatedAt: string;
    status: string;
  }[];
}

export interface ProductListResponseModel {
  products: ProductModel[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
