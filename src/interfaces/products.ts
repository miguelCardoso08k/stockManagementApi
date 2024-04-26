import { Decimal } from "@prisma/client/runtime/library";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: Decimal;
  ownerId: string;
  stock?: number;
}

export interface CreateProduct {
  name: string;
  description?: string;
  price: Decimal;
  stock?: number;
  ownerId: string;
}

export interface ModifyProduct {
  column: "name" | "description" | "price";
  value: string | Decimal;
}

export interface UpdateProduct {
  id: string;
  modify: ModifyProduct;
}

export interface UpdateProductPrisma {
  id: string;
  value: string | Decimal | number;
}

export interface ProductRepository {
  create(data: CreateProduct): Promise<Product>;
  getAll(data: { ownerId: string }): Promise<null | Product[]>;
  getByName(data: { ownerId: string; name: string }): Promise<Product[]>;
  getById(data: { id: string }): Promise<null | Product>;
  updateName(data: UpdateProductPrisma): Promise<null | Product>;
  updateDescription(data: UpdateProductPrisma): Promise<null | Product>;
  updatePrice(data: UpdateProductPrisma): Promise<null | Product>;
  updateStock(data: UpdateProductPrisma): Promise<null | Product>;
  delete(data: { id: string }): Promise<null | Product>;
}
