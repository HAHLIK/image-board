import type {Post} from '../../entities/posts'

export function getPosts(url: string, setPosts: ((posts: Post[]) => void)) {
    fetch(url)
      .then(response => response.json())
      .then(json => setPosts(normalizeTimeStamp(json.posts)))
      .catch(error => console.error(error));
}

function normalizeTimeStamp(posts: Post[]) {
  for (let i = 0; i < posts.length; i++) {
    let date = new Date(posts[i].timestamp)
    posts[i].timestamp = date.toLocaleString()
  }
  return posts
}