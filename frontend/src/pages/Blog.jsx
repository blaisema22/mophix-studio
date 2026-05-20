import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          blogService.getPosts({ limit: 12 }),
          blogService.getCategories(),
        ]);

        setPosts(postsResponse.data || postsResponse || []);
        setCategories(categoriesResponse.data || categoriesResponse || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const categoryList = ['all', ...categories.map((category) => category.name)];

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((post) => post.BlogCategory?.name === selectedCategory);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  const totalPosts = posts.length;
  const totalCategories = categories.length;
  const mostViewed = [...posts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0))[0];
  const latestDate = posts
    .filter((post) => post.published_date)
    .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))[0]?.published_date;

  const formatDate = (value) => {
    if (!value) return 'Unpublished';
    return new Date(value).toLocaleDateString('en-RW', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getExcerpt = (post) => {
    if (post.excerpt) return post.excerpt;
    const text = (post.content || '').replace(/<[^>]+>/g, '');
    return text.length > 160 ? `${text.substring(0, 160).trim()}...` : text;
  };

  const fallbackBlogImages = [
    `${process.env.PUBLIC_URL}/assets/wedding.jpeg`,
    `${process.env.PUBLIC_URL}/assets/pregnancy.webp`,
    `${process.env.PUBLIC_URL}/assets/Family.jpeg`,
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-[2rem] mb-10 h-[340px] shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=1400&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70" />
        <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
          <p className="text-sm uppercase tracking-[0.4em] mb-3">Studio Stories</p>
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Blog</h1>
          <p className="max-w-2xl text-lg text-gray-100/90">
            Read the latest tips, behind-the-scenes stories, and photography inspiration from Mophix Studio.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 mb-2">Posts</p>
              <p className="text-3xl font-semibold">{totalPosts}</p>
              <p className="text-sm text-gray-300 mt-2">Published stories</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 mb-2">Categories</p>
              <p className="text-3xl font-semibold">{totalCategories}</p>
              <p className="text-sm text-gray-300 mt-2">Topic buckets</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 mb-2">Popular</p>
              <p className="text-3xl font-semibold">{mostViewed?.view_count || 0}</p>
              <p className="text-sm text-gray-300 mt-2">Top reads</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 mb-2">Latest</p>
              <p className="text-3xl font-semibold">{latestDate ? formatDate(latestDate) : '—'}</p>
              <p className="text-sm text-gray-300 mt-2">Newest release</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 rounded-[2rem] border border-gray-200/20 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-3">Blog archive</p>
            <h2 className="section-title">Discover studio stories and useful photography advice</h2>
            <p className="section-subtitle max-w-2xl">
              Filter by category, preview featured lessons, and explore the latest blog updates from Mophix Studio.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {categoryList.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? 'bg-secondary text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredPosts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {featuredPost && (
            <article className="card overflow-hidden shadow-xl">
              <div className="relative h-[420px] overflow-hidden">
                <img
                  src={featuredPost.featured_image_url || `${process.env.PUBLIC_URL}/assets/image (1).jpeg`}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="inline-flex rounded-full bg-secondary/90 px-4 py-2 text-xs uppercase tracking-[0.3em] font-semibold mb-4">
                    {featuredPost.BlogCategory?.name || 'Photography'}
                  </span>
                  <h2 className="text-4xl font-semibold mb-4">{featuredPost.title}</h2>
                  <p className="max-w-2xl text-sm text-gray-200/90 mb-6">{getExcerpt(featuredPost)}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200">
                    <span>{featuredPost.User ? `${featuredPost.User.first_name} ${featuredPost.User.last_name}` : 'Studio team'}</span>
                    <span>•</span>
                    <span>{formatDate(featuredPost.published_date)}</span>
                    <span>•</span>
                    <span>{featuredPost.view_count || 0} views</span>
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`} className="btn-secondary mt-6 inline-block">Read full story</Link>
                </div>
              </div>
            </article>
          )}

          <div className="grid gap-6">
            {otherPosts.map((post) => (
              <article key={post.post_id} className="card overflow-hidden shadow-lg">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.featured_image_url || `${process.env.PUBLIC_URL}/assets/image (2).jpeg`}
                    alt={post.title}
                    className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                    {post.BlogCategory?.name || 'Photography'}
                  </span>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>{formatDate(post.published_date)}</span>
                    <span>•</span>
                    <span>{post.User ? `${post.User.first_name} ${post.User.last_name}` : 'Studio'}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 leading-tight">{post.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-5">{getExcerpt(post)}</p>
                  <Link to={`/blog/${post.slug}`} className="btn-outline">Read post</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fallbackBlogImages.map((src, index) => (
            <article key={index} className="card overflow-hidden shadow-xl">
              <div className="h-72 overflow-hidden">
                <img
                  src={src}
                  alt={`Blog fallback ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Journal inspiration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our blog is coming soon with tips, stories, and expert photography guidance.
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Blog;
