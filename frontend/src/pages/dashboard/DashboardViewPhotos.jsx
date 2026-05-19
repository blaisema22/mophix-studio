import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { galleriesService } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardViewPhotos = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);

  const galleryIdQuery = searchParams.get('galleryId');

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const response = await galleriesService.getAll({ created_by: user?.user_id, is_published: true, limit: 50 });
        const items = response.data || [];
        setGalleries(items);
        const initialGallery = items.find((gallery) => String(gallery.gallery_id) === galleryIdQuery) || items[0] || null;
        setSelectedGallery(initialGallery);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadGalleries();
  }, [user, galleryIdQuery]);

  useEffect(() => {
    const loadPhotos = async () => {
      if (!selectedGallery) {
        setPhotos([]);
        return;
      }

      setPhotosLoading(true);
      try {
        const response = await galleriesService.getPhotos(selectedGallery.gallery_id, { limit: 100 });
        setPhotos(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setPhotosLoading(false);
      }
    };

    loadPhotos();
  }, [selectedGallery]);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiBase = (process.env.REACT_APP_API_URL || '').replace(/\/api\/v1\/?$/, '');
    return `${apiBase}${path}`;
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title">View Delivered Photos</h1>
          <p className="section-subtitle">Browse your completed sessions and view the photos delivered to you.</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : galleries.length === 0 ? (
        <div className="text-gray-400">No delivered galleries found yet. Once staff publish your session gallery, it will appear here.</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-4">
            <div className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-3">Choose a session</h2>
              <div className="space-y-3">
                {galleries.map((gallery) => (
                  <button
                    key={gallery.gallery_id}
                    type="button"
                    onClick={() => setSelectedGallery(gallery)}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selectedGallery?.gallery_id === gallery.gallery_id ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-300 hover:border-orange-500/40 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{gallery.title || 'Delivered gallery'}</p>
                        <p className="text-sm text-gray-400">{gallery.description || 'Completed session ready to view.'}</p>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
                        {gallery.photo_count || 0} photos
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-orange-400/80">Gallery Preview</p>
                  <h2 className="text-2xl font-semibold">{selectedGallery?.title || 'Select a gallery'}</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                  {selectedGallery?.published_date ? new Date(selectedGallery.published_date).toLocaleDateString() : 'Published'}
                </span>
              </div>

              {photosLoading ? (
                <LoadingSpinner />
              ) : photos.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {photos.map((photo) => (
                    <div key={photo.photo_id} className="rounded-3xl overflow-hidden border border-white/10 bg-black">
                      <img src={getImageUrl(photo.file_path)} alt={photo.title || 'Gallery photo'} className="h-60 w-full object-cover" />
                      <div className="p-4">
                        <p className="text-sm font-semibold text-white">{photo.title || 'Photo'}</p>
                        <p className="text-sm text-gray-400">{photo.description || 'Delivered by studio'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">This gallery does not have any published photos yet.</div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardViewPhotos;
