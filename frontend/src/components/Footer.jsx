import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#020202] via-[#090909] to-[#040404] text-white py-10 mt-10 border-t border-orange-500/10">
      <div className="mt-8 border-t border-orange-500/20 pt-6 text-center text-xs text-accent">
        © {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
