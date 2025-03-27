import type { WordPressPost } from '../types/wordpress';

const API_BASE_URL = 'https://thelivenagpur.com/wp-json/wp/v2';

/**
 * Fetches a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?slug=${slug}&_embed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const posts = await response.json() as WordPressPost[];
    return posts[0] || null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Fetches posts with pagination
 */
export async function getPosts(page = 1, perPage = 10, options: { embed?: boolean } = {}): Promise<{ 
  posts: WordPressPost[],
  totalPosts: number,
  totalPages: number 
}> {
  try {
    const embed = options.embed ? '&_embed' : '';
    const offset = (page - 1) * perPage;
    
    // First, get total count if not already known
    const countResponse = await fetch(`${API_BASE_URL}/posts?per_page=1`);
    const totalPosts = parseInt(countResponse.headers.get('X-WP-Total') || '0');
    const totalPages = Math.ceil(totalPosts / perPage);
    
    // Then fetch the actual page of posts
    const response = await fetch(`${API_BASE_URL}/posts?per_page=${perPage}&offset=${offset}${embed}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const posts = await response.json() as WordPressPost[];
    
    return {
      posts,
      totalPosts,
      totalPages
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      totalPosts: 0,
      totalPages: 0
    };
  }
}

/**
 * Fetches related posts by category
 */
export async function getRelatedPosts(categoryId: number, excludePostId: number, limit = 3): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts?categories=${categoryId}&exclude=${excludePostId}&per_page=${limit}&_embed`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return await response.json() as WordPressPost[];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

/**
 * Searches posts by query term
 */
export async function searchPosts(query: string, limit = 10): Promise<WordPressPost[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/posts?search=${encodeURIComponent(query)}&per_page=${limit}&_embed`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    return await response.json() as WordPressPost[];
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

/**
 * Fetches all posts for static path generation
 * Uses batched requests to handle large number of posts
 */
export async function getAllPostsForStaticPaths(batchSize = 20): Promise<WordPressPost[]> {
  try {
    // Get total post count
    const countResponse = await fetch(`${API_BASE_URL}/posts?per_page=1`);
    if (!countResponse.ok) throw new Error(`HTTP error! status: ${countResponse.status}`);
    
    const totalPosts = parseInt(countResponse.headers.get('X-WP-Total') || '0');
    const totalPages = Math.ceil(totalPosts / batchSize);
    
    // Fetch all posts in batches
    let allPosts: WordPressPost[] = [];
    
    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(`${API_BASE_URL}/posts?_embed&per_page=${batchSize}&page=${page}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const posts = await response.json() as WordPressPost[];
      allPosts = [...allPosts, ...posts];
    }
    
    return allPosts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
} 