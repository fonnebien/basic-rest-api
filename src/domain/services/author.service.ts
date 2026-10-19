import type { LoggerPort } from "@domain/ports/logger.port.js";
import {
  type Author,
  type AuthorCreation,
  type AuthorUpdate,
} from "@models/author.model.js";
import type { AuthorRepository } from "@repositories/author.repository.js";

export class AuthorService {
  constructor(
    private repository: AuthorRepository,
    private logger: LoggerPort,
  ) {}

  async getAllAuthors(): Promise<Author[]> {
    this.logger.info("Fetching all authors");
    return this.repository.findAll();
  }

  async getAuthorById(id: string): Promise<Author | null> {
    this.logger.info(`Fetching author with ID: ${id}`);
    return this.repository.findById(id);
  }

  async createAuthor(author: AuthorCreation): Promise<Author> {
    this.logger.info("Creating a new author");
    return this.repository.create({ ...author, id: crypto.randomUUID() });
  }

  async updateAuthor(
    id: string,
    changes: AuthorUpdate,
  ): Promise<Author | null> {
    this.logger.info(`Updating author with ID: ${id}`);
    return this.repository.update(id, changes);
  }

  async deleteAuthor(id: string): Promise<boolean> {
    this.logger.info(`Deleting author with ID: ${id}`);
    return this.repository.delete(id);
  }

  async searchAuthors(query: string): Promise<Author[]> {
    this.logger.info(`Searching authors with query: ${query}`);

    const authors = await this.repository.findAll();
    return authors.filter((author) =>
      author.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
}
