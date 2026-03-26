'use client'; // Esto permite usar eventos como onError

import { useState } from 'react';

export default function SafeImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || "https://via.placeholder.com/300x400?text=No+Cover");

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => setImgSrc("https://via.placeholder.com/300x400?text=No+Cover")}
    />
  );
}