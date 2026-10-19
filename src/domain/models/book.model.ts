export interface Book {
  id: string;
  title: string;
  authorId: string;
  publicationYear: number;
  genre?: string;
  summary?: string;
}

export type BookCreation = Omit<Book, "id">;
export type BookUpdate = Partial<BookCreation>;
