import type { Author } from "#domain/models/author.model.js";

export interface AuthorRepository {
  findAll(): Promise<Author[]>;
  findById(id: string): Promise<Author | null>;
  create(author: Author): Promise<Author>;
  update(
    id: string,
    changes: Partial<Omit<Author, "id">>,
  ): Promise<Author | null>;
  delete(id: string): Promise<boolean>;
}
