import { books as booksData } from "@core/index.js";
import { type Book } from "@models/book.model.js";
import { Logger } from "@utils/logger.util.js";

const books: Book[] = booksData as Book[];

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

    if (!books[index]) {
      return null;
    }

    books[index] = {
      ...books[index],
      title: updatedBook.title ?? books[index].title,
      authorId: updatedBook.authorId ?? books[index].authorId,
    };
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
