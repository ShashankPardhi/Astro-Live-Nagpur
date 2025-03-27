/**
 * Interface for WordPress Post objects
 */
export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
    "wp:term"?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy?: string;
    }>>;
    "author"?: Array<{
      id: number;
      name: string;
      url?: string;
    }>;
  };
}

/**
 * Interface for static path generation
 */
export interface PostPath {
  params: {
    slug: string;
  };
  props: {
    post: WordPressPost;
  };
} 