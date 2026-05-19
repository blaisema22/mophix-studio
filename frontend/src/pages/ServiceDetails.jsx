import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/format';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesService.getById(id);
        setService(response.data || response || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!service) return <div className="container mx-auto px-4 py-12"><p className="text-gray-600">Service not found.</p></div>;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="section-title">{service.name}</h1>
          <p className="section-subtitle">{service.description || 'High-quality photography service customized for your event.'}</p>
          <div className="space-y-4 text-gray-700">
            <p><strong>Price:</strong> {formatPrice(service.price, 'Contact us')}</p>
            <p><strong>Duration:</strong> {service.duration_hours || 'Flexible'} hours</p>
            <p><strong>Photos included:</strong> {service.includes_photos_count || 'TBD'}</p>
            <p><strong>Album included:</strong> {service.includes_album ? 'Yes' : 'No'}</p>
            <p><strong>Prints included:</strong> {service.includes_prints ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <aside className="card p-6 bg-primary/5">
          <h2 className="text-xl font-semibold mb-4">Ready to book?</h2>
          <p className="text-gray-700 mb-6">
            Reserve your session, confirm the date, and let Mophix Studio handle the rest.
          </p>
          <Link to={`/book/${service.service_id}`} className="btn-secondary w-full text-center">Book this service</Link>
        </aside>
      </div>
    </section>
  );
};

export default ServiceDetails;
