import { authors as authorsData } from "@core/index.js";
import { type Author } from "@models/author.model.js";
import { Logger } from "@utils/logger.util.js";

const authors: Author[] = authorsData as Author[];

export class AuthorService {
  constructor(private logger: Logger = Logger.getInstance("api:service:author")) {}

  async getAllAuthors(): Promise<Author[]> {
    this.logger.info("Fetching all authors");
    return authors;
  }

  async getAuthorById(id: string): Promise<Author | null> {
    this.logger.info(`Fetching author with ID: ${id}`);

    const author = authors.find((author) => author.id === id);

    return author || null;
  }

  async createAuthor(author: Author): Promise<Author> {
    this.logger.info("Creating a new author");

    authors.push(author);

    return author;
  }

  async updateAuthor(id: string, updatedAuthor: Partial<Author>): Promise<Author | null> {
    this.logger.info(`Updating author with ID: ${id}`);

    const index = authors.findIndex((author) => author.id === id);

    if (index === -1) {
      return null;
    }

    if (!authors[index]) {
      return null;
    }

    authors[index] = { ...authors[index], name: updatedAuthor.name ?? authors[index].name };
    return authors[index];
  }

  async deleteAuthor(id: string): Promise<boolean> {
    this.logger.info(`Deleting author with ID: ${id}`);

    const index = authors.findIndex((author) => author.id === id);

    if (index === -1) {
      return false;
    }

    authors.splice(index, 1);
    return true;
  }

  async searchAuthors(query: string): Promise<Author[]> {
    this.logger.info(`Searching authors with query: ${query}`);

    return authors.filter((author) => author.name.toLowerCase().includes(query.toLowerCase()));
  }
}
