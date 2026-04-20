export type AsyncResult<T> = Promise<
  | { success: true; data: T }
  | { success: false; error: string }
>;

export type Nullable<T> = T | null;

export type DateString = string & { readonly __brand: 'DateString' };
export type UUID = string & { readonly __brand: 'UUID' };

export type Kilograms = number;
export type Seconds = number;

export type CreateInput<T> = Omit<T, 'id' | 'createdAt'>;
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt'>>;