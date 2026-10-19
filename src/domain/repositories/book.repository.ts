import type { Book } from "@models/book.model.js";

export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  create(book: Book): Promise<Book>;
  update(id: string, changes: Partial<Omit<Book, "id">>): Promise<Book | null>;
  delete(id: string): Promise<boolean>;
}
