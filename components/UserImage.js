'use client';

import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

/**
 * Component for displaying user profile images from the backend
 * Automatically prepends the base URL to image paths
 */
export default function UserImage({ src, alt = 'User image', className = '', width = 100, height = 100 }) {
    const imageUrl = getImageUrl(src);

    if (!imageUrl) {
        // Fallback to default avatar if no image
        return (
            <div className={`bg-gray-200 rounded-full flex items-center justify-center ${className}`} style={{ width, height }}>
                <span className="text-gray-500 text-xl">👤</span>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            width={width}
            height={height}
            onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling?.classList.remove('hidden');
            }}
        />
    );
}
