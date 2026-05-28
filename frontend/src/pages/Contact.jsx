import { useState } from 'react';
import { contactService } from '../services/api';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      await contactService.submit(formData);
      setStatus('Your message was sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('There was an error sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12">
          <div className="relative overflow-hidden rounded-[2rem] h-[300px] mb-10 shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80)',
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
              <p className="text-sm uppercase tracking-[0.4em] mb-3">Get in touch</p>
              <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Contact</h1>
              <p className="max-w-2xl text-lg text-gray-100/90">
                Send a message to Mophix Studio and let us help you plan your next photo session.
              </p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-orange-400/20 bg-black-dark p-8 shadow-xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <input
                    className="input-field"
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="input-field"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <input
                  className="input-field"
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                <textarea
                  className="input-field h-40"
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="btn-primary w-full !text-white" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
                {status && <p className={`text-sm ${status.includes('successfully') ? 'text-emerald-300' : 'text-rose-300'}`}>{status}</p>}
              </form>
            </div>

            <aside className="card p-8 bg-white/5 border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">Visit Studio</h2>

              <div className="grid gap-6">
                <div className="w-full h-56 md:h-72 rounded-xl overflow-hidden border border-white/10 bg-black-dark">
                  <iframe
                    title="Mophix Studio Location"
                    src="https://www.google.com/maps?q=KG%20Kaserenge%2C%20Kigali%2C%20Rwanda&output=embed"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div>
                  <p className="text-white/70 mb-2">KG Kaserenge, Kigali, Rwanda</p>
                  <div className="space-y-2">
                    <p className="text-black"><span className="text-orange-400 font-bold">Phone:</span> +250 788 242290</p>
                    <p className="text-black"><span className="text-orange-400 font-bold">Email:</span> info@mophixstudio.rw</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
