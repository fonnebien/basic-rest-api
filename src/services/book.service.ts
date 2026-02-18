import json from "../data/books.json" with { type: "json" };
import type { Book } from "../models/book.model.ts";
import { Logger } from "../util/logger.util.ts";

const books: Book[] = json as Book[];

export class BookService {
  constructor(private logger: Logger = Logger.getInstance("api:service:book")) {}

  async getAllBooks(): Promise<Book[]> {
    this.logger.info("Fetching all books");
    return books;
  }

  async getBookById(id: string): Promise<Book | null> {
    this.logger.info(`Fetching book with ID: ${id}`);

    const book = books.find((book) => book.id === id);

    return book || null;
  }

  async createBook(book: Book): Promise<Book> {
    this.logger.info("Creating a new book");

    books.push(book);

    return book;
  }

  async updateBook(id: string, updatedBook: Partial<Book>): Promise<Book | null> {
    this.logger.info(`Updating book with ID: ${id}`);

    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return null;
    }

    books[index] = { ...books[index], ...updatedBook };
    return books[index];
  }

  async deleteBook(id: string): Promise<boolean> {
    this.logger.info(`Deleting book with ID: ${id}`);

    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return false;
    }

    books.splice(index, 1);
    return true;
  }

  async searchBooks(query: string): Promise<Book[]> {
    this.logger.info(`Searching books with query: ${query}`);

    return books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));
  }
}
