// RevealDiscount.tsx
'use client';

import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

interface RevealDiscountProps {
  discountCode?: string;
  discountAmount?: string;
}

const RevealDiscount: React.FC<RevealDiscountProps> = ({ discountCode = '', discountAmount = '' }) => {
  const [revealed, setRevealed] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      toast.success('Discount code copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy discount code to clipboard');
    }
  };

  return (
    <>
    <div className="flex items-center gap-2 mb-5 text-secondary">
      <span className="flex gap-1 items-center font-bold animate-pulse">
        <svg
          className="w-6 h-6"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="15" cy="9" r="1" fill="currentColor"></circle>
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 4.75H19.25V12L12.5535 18.6708C11.7544 19.4668 10.4556 19.445 9.68369 18.6226L5.28993 13.941C4.54041 13.1424 4.57265 11.8895 5.36226 11.1305L12 4.75Z"
          ></path>
        </svg>
        {discountAmount}
      </span>
      <span>&bull;</span>
      {revealed ? (
        <span className="font-bold">{discountCode}</span>
      ) : (
        <button
        onClick={() => {
          setRevealed(true);
          copyToClipboard();
        }}
          className="font-bold cursor-pointer"
        >
          REVEAL
        </button>
      )}
    </div>
    <Toaster />
    </>
  );
};

export default RevealDiscount;