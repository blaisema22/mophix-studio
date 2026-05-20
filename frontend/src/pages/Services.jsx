import { useEffect, useState } from 'react';
import { servicesService } from '../services/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import formatPrice from '../utils/formatPrice';

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

            return (
              <article key={service.service_id} className="card p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/image (1).webp`}
                    alt="service"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">{service.description || 'A premium photography package designed for your story.'}</p>
                <p className="font-semibold text-primary mb-4">
                  {displayPrice ? `RWF ${displayPrice}` : 'Contact'}
                </p>
                <Link to={`/services/${service.service_id}`} className="btn-outline">
                  View details
                </Link>
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
