import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
} from 'react-icons/fa';
import Navbar from '../Navbar/Navbar';


const ImageSlider = ({ images = [], title, subtitle, author, date }) => {
  const [index] = useState(0);
  const currentImage = images[index] || 'https://via.placeholder.com/1200x600';

  return (
    <>
    <Navbar />
    <div
      className="relative w-full h-[80vh] bg-cover bg-center  bg-scroll" 
      style={{ backgroundImage: `url(${currentImage})` }}
    >
      

      {/* Overlay */}
      <div className="absolute inset-0 opacity-50 bg-black" />

      {/* Centered Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
        <div className="max-w-3xl">
          {/* Breadcrumbs */}
          <div className="text-sm text-white/90 mb-4 space-x-1 font-light">
            <Link to="/" className="hover:underline">Home</Link>
            <span>&gt;</span>
            <Link to="/journal" className="hover:underline">Journal</Link>
            <span>&gt;</span>
            <span className="text-white">{title || 'Article Title'}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-semibold drop-shadow-lg">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-4 text-white/80 text-base md:text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Author & Date */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80">
            {author?.image && (
              <img
                src={author.image}
                alt={author.name || 'Author'}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            )}
            {author?.name && <span>By {author.name}</span>}
            {date && (
              <>
                <span>•</span>
                <span>{date}</span>
              </>
            )}
            <div className="flex items-center gap-3 ml-4 text-white">
              <FaFacebookF className="hover:text-[#c49b8b] cursor-pointer" />
              <FaTwitter className="hover:text-[#c49b8b] cursor-pointer" />
              <FaPinterestP className="hover:text-[#c49b8b] cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ImageSlider;
