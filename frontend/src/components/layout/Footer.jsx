import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand & Social */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              JobHunt
            </h2>
            <p className="text-gray-600 text-sm mb-6 max-w-sm">
              Follow us on social media to stay updated with the latest job openings,
              career tips, and more!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-700" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-500" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
             <div>
                <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                  <li><a href="#" className="hover:text-blue-600">How it works</a></li>
                </ul>
             </div>
             <div>
                <h3 className="font-semibold text-gray-900 mb-4 opacity-0 hidden sm:block">Links</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-blue-600">Job Opportunities</a></li>
                  <li><a href="#" className="hover:text-blue-600">Industries</a></li>
                </ul>
             </div>
             <div>
                <h3 className="font-semibold text-gray-900 mb-4 opacity-0 hidden sm:block">More</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-blue-600">Contests</a></li>
                  <li><a href="#" className="hover:text-blue-600">Upgrade profile</a></li>
                </ul>
             </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4 whitespace-nowrap">Join Our Newsletter</h3>
            <form className="flex bg-white border border-gray-300 rounded-full overflow-hidden p-1">
              <div className="flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
