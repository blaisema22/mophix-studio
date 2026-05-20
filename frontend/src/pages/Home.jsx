import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { servicesService, galleriesService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import formatPrice from '../utils/formatPrice';

const heroImages = [
  `${process.env.PUBLIC_URL}/assets/image (1).jpeg`,
  `${process.env.PUBLIC_URL}/assets/image (2).jpeg`,
  `${process.env.PUBLIC_URL}/assets/image (3).jpeg`,
  `${process.env.PUBLIC_URL}/assets/image (4).jpeg`,
  `${process.env.PUBLIC_URL}/assets/image (5).jpeg`,
];

const popularServiceImages = {
  wedding: `${process.env.PUBLIC_URL}/assets/wedding.jpeg`,
  maternity: `${process.env.PUBLIC_URL}/assets/pregnancy.webp`,
  pregnancy: `${process.env.PUBLIC_URL}/assets/pregnancy.webp`,
  family: `${process.env.PUBLIC_URL}/assets/Family.jpeg`,
};

const getPopularServiceImage = (service) => {
  const category = (service.category || service.name || '').toString().trim().toLowerCase();
  if (popularServiceImages[category]) return popularServiceImages[category];
  if (category.includes('wedding')) return popularServiceImages.wedding;
  if (category.includes('pregnancy') || category.includes('maternity')) return popularServiceImages.maternity;
  if (category.includes('family')) return popularServiceImages.family;
  return `${process.env.PUBLIC_URL}/assets/image (1).jpeg`;
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const message = 'Capturing life, one frame at a time.';

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timer;

    const type = () => {
      setTypedText(message.slice(0, currentIndex));

      if (!isDeleting) {
        if (currentIndex < message.length) {
          currentIndex++;
          const typingSpeed = 120 + (Math.random() * 120 - 40);
          timer = setTimeout(type, typingSpeed);
        } else {
          isDeleting = true;
          timer = setTimeout(type, 2500);
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
          const deletingSpeed = 60 + (Math.random() * 40 - 20);
          timer = setTimeout(type, deletingSpeed);
        } else {
          isDeleting = false;
          timer = setTimeout(type, 500);
        }
      }
    };

    type();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-4">Kigali Photography</p>
          <h1 className="section-title">
            {typedText}
            <span className="inline-block ml-1 w-[3px] h-[0.9em] bg-orange-500 animate-pulse align-middle" />
          </h1>
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
            <div className="absolute inset-0 overflow-hidden">
              {heroImages.map((src, index) => (
                <img
                  key={src}
                  src={encodeURI(src)}
                  alt={`hero-${index}`}
                  className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-700 ease-out ${heroIndex === index ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
            <div
              className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))' }}
            />
            <div className="relative h-full flex flex-col justify-end p-8 text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.45)' }}>
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

      {/* Scroll to Discover Animation */}
      <div className="mt-20 flex flex-col items-center opacity-60">
        <span className="text-[10px] uppercase tracking-[0.4em] mb-4 text-gray-500 font-medium">Scroll to Discover</span>
        <div className="w-[22px] h-[38px] rounded-full border-2 border-gray-600 flex justify-center p-1.5">
          <div className="w-1 h-2 bg-orange-500 rounded-full animate-bounce" />
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
            {services.length > 0 ? services.map((service) => {
              const displayPrice = formatPrice(service.price, 0);
              const cardImage = getPopularServiceImage(service);

              return (
                <article key={service.service_id} className="card overflow-hidden shadow-lg">
                  <div className="h-56 overflow-hidden">
                    <img
                      src={encodeURI(cardImage)}
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
                    <p className="text-gray-300 leading-relaxed mb-4">{service.description || 'A premium photography package designed for your story.'}</p>
                    <p className="font-semibold text-primary mb-3">
                      {displayPrice ? `RWF ${displayPrice}k` : 'Contact'}
                    </p>
                    <Link to={`/services/${service.service_id}`} className="btn-outline">View details</Link>
                  </div>
                </article>
              );
            }) : (
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
