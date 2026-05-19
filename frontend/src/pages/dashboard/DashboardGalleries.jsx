import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleriesService } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardGalleries = () => {
  const { user } = useAuthStore();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await galleriesService.getAll({ created_by: user?.user_id, is_published: true, limit: 20 });
        setGalleries(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchGalleries();
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">My Galleries</h1>
        <p className="section-subtitle">Review delivered photos and keep track of your latest sessions.</p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : galleries.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {galleries.map((gallery) => (
            <article key={gallery.gallery_id} className="rounded-[1.75rem] overflow-hidden border border-orange-500/20 bg-[#141414] shadow-xl">
              <div
                className="h-52 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${gallery.cover_image_path || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'})`,
                }}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{gallery.title || 'Delivered gallery'}</h2>
                <p className="text-gray-400 mb-4">{gallery.description || 'Your delivered session photos are available here.'}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-gray-300">
                    {gallery.photo_count || 0} photo{gallery.photo_count === 1 ? '' : 's'}
                  </span>
                  <Link
                    to={`/dashboard/galleries/view?galleryId=${gallery.gallery_id}`}
                    className="btn-outline"
                  >
                    View photos
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">No galleries found yet. Your latest photos will appear here.</div>
      )}
    </div>
  );
};

export default DashboardGalleries;
