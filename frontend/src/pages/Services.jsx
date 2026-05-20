import { useEffect, useState } from 'react';
import { servicesService } from '../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import formatPrice from '../utils/formatPrice';

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
    <section className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-[2rem] h-[320px] mb-10 shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
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
              <article key={service.service_id} className="card overflow-hidden shadow-lg">
                <div className="h-56 overflow-hidden">
                  <img
                    src={encodeURI(backgroundImage)}
                    alt={service.category || service.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                      {service.category || 'Photography'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 leading-tight">{service.name}</h3>
                  <p className="text-gray-300  leading-relaxed">{service.description || 'A premium photography package designed for your story.'}</p>
                  <p className="font-semibold text-primary mb-3">
                    {displayPrice ? `RWF ${displayPrice}k` : 'Contact'}
                  </p>
                  <Link to={`/services/${service.service_id}`} className="btn-outline">
                    View details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-600">No service packages are available yet.</div>
      )}
    </section>
  );
};

export default Services;
