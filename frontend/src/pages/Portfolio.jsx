import { useEffect, useState } from 'react';
import { galleriesService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Portfolio = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await galleriesService.getAll();
        setGalleries(response.data || response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const eventTypes = [
    'all',
    ...Array.from(
      new Set(
        galleries
          .map((gallery) => (gallery.event_type || 'General').toString().trim())
          .filter(Boolean)
          .map((type) => type)
      )
    ),
  ];

  const visibleGalleries = selectedType === 'all'
    ? galleries
    : galleries.filter((gallery) => (gallery.event_type || 'General').toString().trim() === selectedType);

  const totalPhotos = galleries.reduce((sum, gallery) => sum + (Number(gallery.photo_count) || 0), 0);
  const publishedCount = galleries.filter((gallery) => gallery.is_published).length;
  const latestPublished = galleries
    .filter((gallery) => gallery.published_date)
    .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))[0]?.published_date;

  const formatDate = (value) => {
    if (!value) return 'Unpublished';
    return new Date(value).toLocaleDateString('en-RW', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const fallbackPortfolioImages = [
    `${process.env.PUBLIC_URL}/assets/wedding.jpeg`,
    `${process.env.PUBLIC_URL}/assets/pregnancy.webp`,
    `${process.env.PUBLIC_URL}/assets/Family.jpeg`,
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-[2rem] mb-10 h-[420px] shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/60" />
        <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
          <p className="text-sm uppercase tracking-[0.4em] mb-3">Signature Collections</p>
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Portfolio</h1>
          <p className="max-w-2xl text-lg text-gray-100/90">
            Explore curated galleries from weddings, portraits, events, and brand campaigns — each story delivered in rich imagery and polished style.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 mb-2">Galleries</p>
              <p className="text-3xl font-semibold">{galleries.length}</p>
              <p className="text-sm text-gray-300 mt-2">Curated collections</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 mb-2">Published</p>
              <p className="text-3xl font-semibold">{publishedCount}</p>
              <p className="text-sm text-gray-300 mt-2">Published sets</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 mb-2">Photos</p>
              <p className="text-3xl font-semibold">{totalPhotos}</p>
              <p className="text-sm text-gray-300 mt-2">Images available</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300 mb-2">Latest</p>
              <p className="text-3xl font-semibold">{latestPublished ? formatDate(latestPublished) : '—'}</p>
              <p className="text-sm text-gray-300 mt-2">Newest release</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 rounded-[2rem] border border-gray-200/20 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-3">Portfolio overview</p>
            <h2 className="section-title">Capture the full story behind every shoot</h2>
            <p className="section-subtitle max-w-2xl">
              Browse event type filters, gallery summaries, and high-level details for each published session.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {eventTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedType === type ? 'bg-secondary text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : visibleGalleries.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleGalleries.map((gallery) => (
            <article key={gallery.gallery_id} className="card overflow-hidden shadow-xl">
              <div className="relative h-72 overflow-hidden">
                <img
                  src={gallery.cover_image_path || 'https://images.unsplash.com/photo-1499856871958-5b962f4bb7cf?auto=format&fit=crop&w=900&q=80'}
                  alt={gallery.title || 'Portfolio gallery'}
                  className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                  {gallery.event_type || 'General'}
                </span>
              </div>
              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-sm uppercase tracking-[0.3em] text-secondary">{gallery.photo_count || 0} photos</span>
                  <span className="text-sm uppercase tracking-[0.3em] text-gray-500">•</span>
                  <span className="text-sm uppercase tracking-[0.3em] text-gray-500">{formatDate(gallery.published_date)}</span>
                </div>
                <h2 className="text-2xl font-semibold mb-3 leading-tight">{gallery.title || 'Untitled Gallery'}</h2>
                <p className="text-gray-600 mb-5 leading-relaxed">{gallery.description || 'No description available for this session.'}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-gray-100/80 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Gallery ID</p>
                    <p className="mt-2 font-semibold text-gray-900">{gallery.gallery_id}</p>
                  </div>
                  <div className="rounded-3xl bg-gray-100/80 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Status</p>
                    <p className="mt-2 font-semibold text-gray-900">{gallery.is_published ? 'Published' : 'Draft'}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="btn-secondary"
                  >
                    View gallery
                  </button>
                  <span className="text-sm text-gray-500">{gallery.created_by ? `Curated by user ${gallery.created_by}` : 'Curated by the studio'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {fallbackPortfolioImages.map((src, index) => (
            <article key={index} className="card overflow-hidden shadow-xl">
              <div className="h-72 overflow-hidden">
                <img
                  src={encodeURI(src)}
                  alt={`Portfolio fallback ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Portfolio Inspiration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse these featured looks while our newest collections are being prepared.
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Portfolio;
