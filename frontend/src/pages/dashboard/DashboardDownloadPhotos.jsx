import { useEffect, useState } from 'react';
import { galleriesService } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardDownloadPhotos = () => {
  const { user } = useAuthStore();
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);

  const getImageAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiBase = (process.env.REACT_APP_API_URL || '').replace(/\/api\/v1\/?$/, '');
    return `${apiBase}${path}`;
  };

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const response = await galleriesService.getAll({ created_by: user?.user_id, is_published: true, limit: 20 });
        const items = response.data || [];
        setGalleries(items);
        setSelectedGallery(items[0] || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadGalleries();
  }, [user]);

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Download Photos</h1>
        <p className="section-subtitle">Select a delivered session and download the images sent to you by the studio.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : galleries.length === 0 ? (
        <div className="text-gray-400">No delivered galleries available yet.</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-4">
            <div className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Select a gallery</h2>
              <div className="space-y-3">
                {galleries.map((gallery) => (
                  <button
                    key={gallery.gallery_id}
                    type="button"
                    onClick={() => setSelectedGallery(gallery)}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selectedGallery?.gallery_id === gallery.gallery_id ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-300 hover:border-orange-500/40 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{gallery.title || 'Delivered gallery'}</p>
                        <p className="text-sm text-gray-400">{gallery.description || 'Download complete session photos.'}</p>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
                        {gallery.photo_count || 0} photo{gallery.photo_count === 1 ? '' : 's'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-6 shadow-xl">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.4em] text-orange-400/80">Download gallery</p>
                <h2 className="text-2xl font-semibold">{selectedGallery?.title || 'Choose a gallery'}</h2>
              </div>
              {photosLoading ? (
                <LoadingSpinner />
              ) : photos.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">Click any photo below to open it in a new tab and download directly.</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {photos.map((photo) => {
                      const url = getImageAssetUrl(photo.file_path);
                      return (
                        <a key={photo.photo_id} href={url} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-3xl border border-white/10 bg-black transition hover:border-orange-500/30">
                          <img src={url} alt={photo.title || 'Delivered photo'} className="h-48 w-full object-cover" />
                          <div className="p-4">
                            <p className="font-semibold text-white">{photo.title || 'Photo'}</p>
                            <p className="text-sm text-gray-400">Click to open and download.</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">There are no photos in this gallery yet.</div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardDownloadPhotos;
