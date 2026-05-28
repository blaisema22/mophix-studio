import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { servicesService, galleriesService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import formatPrice from '../utils/formatPrice';
import Footer from '../components/Footer';

const heroImages = [
  `${process.env.PUBLIC_URL}/assets/image (1).jpeg`,
  `${process.env.PUBLIC_URL}/assets/image (2).jpeg`,
  `${process.env.PUBLIC_URL}/assets/image (3).jpeg`,
  `${process.env.PUBLIC_URL}/assets/image (4).jpeg`,
  `${process.env.PUBLIC_URL}/assets/image (5).jpeg`,
];

// Helper to get a specific image for service cards based on category
const getServiceImage = (service) => {
  const category = (service.category || service.name || '').toString().trim().toLowerCase();
  
  if (category.includes('wedding')) return `${process.env.PUBLIC_URL}/assets/wedding.jpeg`;
  if (category.includes('pregnancy') || category.includes('maternity')) return `${process.env.PUBLIC_URL}/assets/pregnancy.webp`;
  if (category.includes('family')) return `${process.env.PUBLIC_URL}/assets/Family.jpeg`;
  if (category.includes('graduation')) return `${process.env.PUBLIC_URL}/assets/graduationmm.jpeg`;
  if (category.includes('outdoor')) return `${process.env.PUBLIC_URL}/assets/outdoor.jpeg`;
  if (category.includes('studio')) return `${process.env.PUBLIC_URL}/assets/studio.webp`;
  
  return `${process.env.PUBLIC_URL}/assets/image (1).jpeg`;
};

const fallbackPortfolioImages = [
  `${process.env.PUBLIC_URL}/assets/party.jpeg`,
  `${process.env.PUBLIC_URL}/assets/Beautiful Model.jpg`,
  `${process.env.PUBLIC_URL}/assets/image (3).jpeg`,
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [currentServiceCardIndex, setCurrentServiceCardIndex] = useState(0); // New state for service card carousel
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
    const loadContent = async () => {
      try {
        const [servicesResponse, galleriesResponse] = await Promise.all([
          servicesService.getAll({ limit: 12 }),
          galleriesService.getAll({ limit: 6 }),
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

  // New useEffect for service card carousel
  useEffect(() => {
    if (services.length === 0) return;
    const numVisibleCards = 3; // Assuming 3 cards are visible at a time
    const maxIndex = services.length > numVisibleCards ? services.length - numVisibleCards : 0;

    const interval = setInterval(() => {
      setCurrentServiceCardIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
    }, 7000); // Change every 7 seconds for service cards
    return () => clearInterval(interval);
  }, [services.length]); // Depend on services.length to re-calculate totalSlides

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow">
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
                <div 
                  className="flex h-full w-full transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateX(-${heroIndex * 100}%)` }}
                >
                  {heroImages.map((src, index) => (
                    <div key={src} className="min-w-full h-full">
                      <img
                        src={encodeURI(src)}
                        alt={`hero-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))' }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.45)' }}>
                  <p className="text-sm uppercase tracking-[0.4em] mb-2">Premium imagery</p>
                  <h2 className="text-3xl sm:text-4xl font-semibold">Create timeless stories.</h2>
                  <p className="mt-4 max-w-xl text-gray-100/90">
                    Stunning visual narratives for couples, brands, and events with attention to every detail.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1].map((offset) => (
                  <div
                    key={offset}
                    className="relative h-48 rounded-[1.75rem] overflow-hidden shadow-lg"
                  >
                    <div 
                      className="flex h-full w-full transition-transform duration-1000 ease-in-out"
                      style={{ transform: `translateX(-${((heroIndex + offset + 1) % heroImages.length) * 100}%)` }}
                    >
                      {heroImages.map((src, idx) => (
                        <div key={src} className="min-w-full h-full">
                          <img
                            src={encodeURI(src)}
                            alt={`side-${offset}-${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll prompt removed per request */}

          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Popular Services</h2>
                <p className="text-white/50">Choose the right photography package for your next event.</p>
              </div>
              <Link to="/services" className="text-primary hover:underline">View all services</Link>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="relative overflow-hidden"> {/* Viewport for the carousel */}
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentServiceCardIndex * (100 / 3)}%)` 
                  }} // Slide by the width of one card (33.33%)
                >
                  {services.length > 0 ? services.map((service) => {
                    const displayPrice = formatPrice(service.price, 0);
                    const serviceImage = getServiceImage(service);

                    return (
                      <div key={service.service_id} className="flex-shrink-0 w-full md:w-1/3 px-3">
                        <article className="card h-full overflow-hidden shadow-lg">
                          <div className="h-56 overflow-hidden">
                            <img 
                              src={encodeURI(serviceImage)} 
                              alt={service.category || service.name} 
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                            />
                          </div>
                          <div className="p-6">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black">
                                {service.category || 'Photography'}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 leading-tight text-black">{service.name}</h3>
                            <p className="text-black leading-relaxed mb-4 line-clamp-2">{service.description || 'A premium photography package designed for your story.'}</p>
                            <p className="font-semibold text-primary mb-3">
                              {displayPrice ? `RWF ${displayPrice}k` : 'Contact'}
                            </p>
                            <Link to={`/services/${service.service_id}`} className="btn-outline">View details</Link>
                          </div>
                        </article>
                      </div>
                    );
                  }) : (
                    <div className="w-full text-center text-white/50">No services available at the moment.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Featured Portfolio</h2>
                <p className="text-white/50">A selection of recent shoots across weddings, events, and portraits.</p>
              </div>
              <Link to="/portfolio" className="text-primary hover:underline">View full portfolio</Link>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {galleries.length > 0 ? galleries.map((gallery, idx) => (
                    <Link to={`/portfolio/${gallery.gallery_id}`} key={gallery.gallery_id} className="card overflow-hidden shadow-xl border border-white/5 transition-transform hover:-translate-y-1 block">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={encodeURI(gallery.cover_image_path || fallbackPortfolioImages[idx % fallbackPortfolioImages.length])} 
                          alt={gallery.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        />
                      </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{gallery.title}</h3>
                        <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full uppercase tracking-widest">{gallery.event_type || 'Session'}</span>
                      </div>
                      <p className="text-white/50">{gallery.description || 'Beautiful gallery from a recent shoot.'}</p>
                    </div>
                  </Link>
                )) : (
                  fallbackPortfolioImages.map((src, index) => (
                    <article key={index} className="card overflow-hidden shadow-lg">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={encodeURI(src)} 
                          alt={`Portfolio fallback ${index}`} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-black">Portfolio Inspiration</h3>
                        <p className="text-black/70">New collections are coming soon — explore our featured portfolio when it is ready.</p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
