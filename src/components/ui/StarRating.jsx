import React from 'react'
import { Star } from 'lucide-react'

const StarRating = ({ rating, reviewCount, size = 16 }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500 font-medium">{rating}</span>
    {reviewCount && <span className="text-sm text-gray-400">({reviewCount} reviews)</span>}
  </div>
)

export default StarRating
