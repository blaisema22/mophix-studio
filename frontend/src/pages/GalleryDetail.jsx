import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { galleriesService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const GalleryDetail = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 50;

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const [galleryRes, photosRes] = await Promise.all([
          galleriesService.getById(id),
          galleriesService.getPhotos(id, { limit: LIMIT, page: 1 })
        ]);
        setGallery(galleryRes.data || galleryRes);
        const fetchedPhotos = photosRes.data || photosRes || [];
        setPhotos(fetchedPhotos);
        setHasMore(fetchedPhotos.length === LIMIT);
      } catch (error) {
        console.error('Error fetching gallery details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsModalAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setPhotoIndex((prev) => (prev + photos.length - 1) % photos.length);
      if (e.key === 'ArrowRight') setPhotoIndex((prev) => (prev + 1) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length]);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const photosRes = await galleriesService.getPhotos(id, { limit: LIMIT, page: nextPage });
      const nextPhotos = photosRes.data || photosRes || [];
      if (nextPhotos.length > 0) {
        setPhotos(prev => [...prev, ...nextPhotos]);
        setPage(nextPage);
        setHasMore(nextPhotos.length === LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more photos:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiBase = (process.env.REACT_APP_API_URL || '').replace(/\/api\/v1\/?$/, '');
    return `${apiBase}${path}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success('Gallery link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const closeLightbox = () => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>;
  
  if (!gallery) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Gallery not found</h2>
        <Link to="/portfolio" className="btn-primary">Return to Portfolio</Link>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12">
        <Link to="/portfolio" className="text-orange-400 hover:text-orange-300 text-sm uppercase tracking-[0.3em] mb-6 inline-block transition-colors">
          ← Back to Portfolio
        </Link>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-3">{gallery.event_type || 'Photography'}</p>
            <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-white leading-tight">{gallery.title}</h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {gallery.description || 'A curated collection of professional imagery capturing timeless moments and stories.'}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Delivered</div>
              <div className="text-lg font-medium text-white">
                {gallery.published_date ? new Date(gallery.published_date).toLocaleDateString('en-RW', { month: 'long', year: 'numeric' }) : 'Recently'}
              </div>
            </div>
            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 transition-all text-sm font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Share Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
          {photos.map((photo, index) => (
            <button
              key={photo.photo_id || index}
              type="button"
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
              className="group relative w-full mb-8 break-inside-avoid overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-white/5 shadow-2xl transition-transform duration-500 hover:-translate-y-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 block"
            >
              <img 
                src={getImageUrl(photo.file_path)} 
                alt={photo.title || gallery.title} 
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-left">
                <p className="text-white text-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{photo.title || 'Untitled'}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-white/5 bg-white/5">
          <p className="text-gray-500 text-lg">Images are currently being processed. Check back soon.</p>
        </div>
      )}

      {/* Load More Section */}
      {photos.length > 0 && hasMore && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold transition-all hover:bg-orange-500 hover:text-black hover:border-orange-500 disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                Loading images...
              </>
            ) : (
              <>
                <span>Load More Images</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-y-1">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 ${isModalAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 z-[110] text-white/50 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <button
            onClick={() => setPhotoIndex((photoIndex + photos.length - 1) % photos.length)}
            className="absolute left-4 md:left-8 z-[110] text-white/30 hover:text-orange-400 transition-all p-4"
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <div 
            className={`max-w-[90%] max-h-[85%] flex flex-col items-center justify-center transition-all duration-300 transform ${isModalAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(photos[photoIndex].file_path)}
              alt={photos[photoIndex].title || gallery.title}
              className="max-w-full max-h-full rounded-xl object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            />
            
            <div className="mt-8 text-center max-w-xl">
              <h3 className="text-xl font-semibold text-white">{photos[photoIndex].title || 'Untitled'}</h3>
              {photos[photoIndex].description && (
                <p className="text-gray-400 mt-2 line-clamp-2">{photos[photoIndex].description}</p>
              )}
              <div className="mt-6 flex items-center justify-center gap-4">
                <a
                  href={getImageUrl(photos[photoIndex].file_path)}
                  target="_blank"
                  rel="noreferrer"
                  download={photos[photoIndex].title || 'mophix-studio-photo'}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download High Res
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}
            className="absolute right-4 md:right-8 z-[110] text-white/30 hover:text-orange-400 transition-all p-4"
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default GalleryDetail;