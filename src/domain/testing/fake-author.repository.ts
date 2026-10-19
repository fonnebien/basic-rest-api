import type { Author } from "@models/author.model.js";
import type { AuthorRepository } from "@repositories/author.repository.js";

export class FakeAuthorRepository implements AuthorRepository {
  constructor(private authors: Author[] = []) {}

  async findAll(): Promise<Author[]> {
    return [...this.authors];
  }

  async findById(id: string): Promise<Author | null> {
    return this.authors.find((author) => author.id === id) ?? null;
  }

  async create(author: Author): Promise<Author> {
    this.authors.push(author);
    return author;
  }

  async update(
    id: string,
    changes: Partial<Omit<Author, "id">>,
  ): Promise<Author | null> {
    const index = this.authors.findIndex((author) => author.id === id);
    const existing = this.authors[index];

    if (!existing) {
      return null;
    }

    const updated: Author = { ...existing, ...changes, id };
    this.authors[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.authors.findIndex((author) => author.id === id);

    if (index === -1) {
      return false;
    }

    this.authors.splice(index, 1);
    return true;
  }
}
