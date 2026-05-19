import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#090909] text-gray-200 py-10 mt-10 border-t border-orange-500/10">
      <div className="mt-8 border-t border-orange-500/20 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
