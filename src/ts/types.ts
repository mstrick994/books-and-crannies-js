// Type Definitions for Books & Crannies

export interface Book {
  title: string;
  author: string;
  genre: string;
  year: number;
  best_seller: boolean;
  trending: boolean;
  description: string;
  image: string;
  link: string;
}

export interface ToggleResult {
  inCollection: boolean;
  collectionSet: Set<string>;
}

export interface FilterState {
  searchQuery: string;
  searchBy: string;
  selectedGenre: string | null;
  selectedYear: number | null;
  showOnlyTrending: boolean | null;
}

export interface PopulateGenreOptions {
  genreList: readonly string[];
  desktopGenreList: HTMLElement | null;
  mobileGenreList: HTMLElement | null;
  includeAllOption?: boolean;
}

export interface RenderBookCardOptions {
  book: Book;
  originalIndex: number;
  inCollection: boolean;
}
