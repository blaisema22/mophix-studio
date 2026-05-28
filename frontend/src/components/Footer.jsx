import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';

const Footer = () => {

  return (
    <footer className="bg-black border-t border-orange-400/10 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
              Mophix <span className="text-orange-400">STUDIO</span>
            </h3>
            <p className="text-white/70 max-w-xs leading-relaxed">
              Capturing moments and creating digital excellence. Professional photography and media services tailored to your artistic vision.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/70 hover:text-orange-400 transition-colors duration-200">Home</Link></li>
              <li><Link to="/portfolio" className="text-white/70 hover:text-orange-400 transition-colors duration-200">Portfolio</Link></li>
              <li><Link to="/services" className="text-white/70 hover:text-orange-400 transition-colors duration-200">Services</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-orange-400 transition-colors duration-200">Blog</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-orange-400 transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-orange-400 transition-colors duration-200">
                <FaInstagram size={20} />

                <span>Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-orange-400 transition-colors duration-200">
                <FaTwitter size={20} />

                <span>Twitter</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-orange-400 transition-colors duration-200">
                <FaFacebookF size={20} />

                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Mofix Studio. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/50">
            <Link to="/privacy" className="hover:text-white/70">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/70">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;