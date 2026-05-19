import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { servicesService, galleriesService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [services, setServices] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [servicesResponse, galleriesResponse] = await Promise.all([
          servicesService.getAll({ limit: 3 }),
          galleriesService.getAll({ limit: 3 }),
        ]);

        setServices(servicesResponse.data || servicesResponse || []);
        setGalleries(galleriesResponse.data || galleriesResponse || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const formatPrice = (price) => {
    const value = Number(price);
    return Number.isFinite(value) ? `RWF ${value.toFixed(0)}` : 'Contact';
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-4">Kigali Photography</p>
          <h1 className="section-title">Capture moments that last a lifetime.</h1>
          <p className="section-subtitle max-w-2xl">
            Mophix Studio crafts premium photography services for weddings, portraits, events, and commercial brands.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link to="/services" className="btn-secondary">View Services</Link>
            <Link to="/portfolio" className="btn-outline">Explore Portfolio</Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[2rem] h-[420px] shadow-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80)',
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <p className="text-sm uppercase tracking-[0.4em] mb-2">Premium imagery</p>
              <h2 className="text-3xl sm:text-4xl font-semibold">Create timeless stories.</h2>
              <p className="mt-4 max-w-xl text-gray-100/90">
                Stunning visual narratives for couples, brands, and events with attention to every detail.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className="h-48 rounded-[1.75rem] bg-cover bg-center shadow-lg"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80)',
              }}
            />
            <div
              className="h-48 rounded-[1.75rem] bg-cover bg-center shadow-lg"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Popular Services</h2>
            <p className="text-gray-600">Choose the right photography package for your next event.</p>
          </div>
          <Link to="/services" className="text-primary hover:underline">View all services</Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {services.length > 0 ? services.map((service) => (
              <article key={service.service_id} className="card p-6">
                <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description || 'Professional photography tailored to your needs.'}</p>
                <p className="font-semibold text-primary mb-4">{formatPrice(service.price)}</p>
                <Link to={`/services/${service.service_id}`} className="btn-outline">View details</Link>
              </article>
            )) : (
              <div className="text-center text-gray-600">No services available at the moment.</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Featured Portfolio</h2>
            <p className="text-gray-600">A selection of recent shoots across weddings, events, and portraits.</p>
          </div>
          <Link to="/portfolio" className="text-primary hover:underline">View full portfolio</Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {galleries.length > 0 ? galleries.map((gallery) => (
              <article key={gallery.gallery_id} className="card overflow-hidden">
                <div className="h-48 bg-gray-200" style={{ backgroundImage: `url(${gallery.cover_image_path || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{gallery.title}</h3>
                  <p className="text-gray-600">{gallery.description || 'Beautiful gallery from a recent shoot.'}</p>
                </div>
              </article>
            )) : (
              <div className="text-center text-gray-600">No galleries published yet.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
