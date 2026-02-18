import json from "../data/authors.json" with { type: "json" };
import type { Author } from "../models/author.model.ts";
import { Logger } from "../util/logger.util.ts";

const authors: Author[] = json as Author[];

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

    authors[index] = { ...authors[index], ...updatedAuthor };
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
