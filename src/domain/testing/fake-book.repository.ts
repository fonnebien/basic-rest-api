import type { Book } from "@models/book.model.js";
import type { BookRepository } from "@repositories/book.repository.js";

export class FakeBookRepository implements BookRepository {
  constructor(private books: Book[] = []) {}

  async findAll(): Promise<Book[]> {
    return [...this.books];
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.find((book) => book.id === id) ?? null;
  }

  async create(book: Book): Promise<Book> {
    this.books.push(book);
    return book;
  }

  async update(
    id: string,
    changes: Partial<Omit<Book, "id">>,
  ): Promise<Book | null> {
    const index = this.books.findIndex((book) => book.id === id);
    const existing = this.books[index];

    if (!existing) {
      return null;
    }

    const updated: Book = { ...existing, ...changes, id };
    this.books[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.books.findIndex((book) => book.id === id);

    if (index === -1) {
      return false;
    }

    this.books.splice(index, 1);
    return true;
  }
}
