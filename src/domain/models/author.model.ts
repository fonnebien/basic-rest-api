export interface Author {
  id: string;
  name: string;
  bio?: string;
  birthDate?: string;
}

export type AuthorCreation = Omit<Author, "id">;
export type AuthorUpdate = Partial<AuthorCreation>;
