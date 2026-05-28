import { useEffect, useState } from 'react';
import { servicesService } from '../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import formatPrice from '../utils/formatPrice';
import Footer from '../components/Footer';

const serviceImages = {
  family: `${process.env.PUBLIC_URL}/assets/Family.jpeg`,
  graduation: `${process.env.PUBLIC_URL}/assets/graduationmm.jpeg`,
  outdoor: `${process.env.PUBLIC_URL}/assets/outdoor.jpeg`,
  pregnancy: `${process.env.PUBLIC_URL}/assets/pregnancy.webp`,
  studio: `${process.env.PUBLIC_URL}/assets/studio.webp`,
  wedding: `${process.env.PUBLIC_URL}/assets/wedding.jpeg`,
};

const getServiceImage = (category) => {
  const lookup = (category || '').toString().trim().toLowerCase();
  return serviceImages[lookup] || `${process.env.PUBLIC_URL}/assets/image (1).jpeg`;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesService.getAll();
        setServices(response.data || response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12">
          <div className="relative overflow-hidden rounded-[2rem] h-[320px] mb-10 shadow-xl">
            <div 
              className="flex h-full w-full transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${heroIndex * 100}%)` }}
            >
              {[
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
                'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
                'https://images.unsplash.com/photo-1499856871958-5b962f4bb7cf?auto=format&fit=crop&w=1400&q=80'
              ].map((url, i) => (
                <div key={i} className="min-w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-black/50" />
            <div className="absolute inset-0 z-10 flex flex-col justify-center p-10 text-white">
              <p className="text-sm uppercase tracking-[0.4em] mb-3">Creative photography</p>
              <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Our Services</h1>
              <p className="max-w-2xl text-lg text-gray-100/90">
                Elegant photography packages crafted for weddings, portraits, events, and brand campaigns.
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const displayPrice = formatPrice(service.price, 0);
                const backgroundImage = getServiceImage(service.category || service.name);

                return (
                  <article key={service.service_id} className="card overflow-hidden shadow-lg bg-white">
                    <div className="h-56 overflow-hidden">
                      <img
                        src={encodeURI(backgroundImage)}
                        alt={service.category || service.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black">
                          {service.category || 'Photography'}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 leading-tight text-black">{service.name}</h3>
                      <p className="text-black/90 leading-relaxed">{service.description || 'A premium photography package designed for your story.'}</p>
                      <p className="font-semibold text-primary mb-3">
                        {displayPrice ? `RWF ${displayPrice}k` : 'Contact'}
                      </p>
                      <Link to={`/services/${service.service_id}`} className="btn-outline text-black border-black hover:bg-orange-100 hover:border-orange-400 hover:text-black">
                        View details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-white/50">No service packages are available yet.</div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
