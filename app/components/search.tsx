'use clientl';

import { FC, ChangeEventHandler, useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import Modal from './modal';

type Props = {
  showSearch: boolean;
  setShowSearch: (showSearch: boolean) => void;
};

const Search: FC<Props> = ({ showSearch, setShowSearch }) => {
  const [term, setTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      const { products, error } = await fetch('/api/products').then((res) =>
        res.json()
      );

      if (!error) {
        setFetchedProducts(products);
        setSearchResults(products);
      }

      setLoading(false);
    }

    getProducts();
  }, []);

  const handleSearch: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setTerm(e.target.value);

    try {
      const filteredProducts = fetchedProducts.filter((product) => {
        if (
          product.title.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return product;
        }
      });

      setSearchResults(filteredProducts);
    } catch (error) {}
  };

  return (
    <Modal
      showModal={showSearch}
      setShowModal={setShowSearch}
      className="max-w-[500px] transition-transform min-h-[50vh]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="py-4 pl-8 w-full text-sm rounded-t-lg border-b border-b-1 border-light-200 focus:outline-none"
          value={term}
          onChange={handleSearch}
        />
        <div className="absolute top-[50%] translate-y-[-50%] left-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-light-200 dark:text-dark-200">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.873-4.873"
            />
            <circle cx="10" cy="10" r="7" />
          </svg>
        </div>

        {loading && (
          <div className="absolute top-[50%] translate-y-[-50%] right-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-400"></div>
          </div>
        )}
      </div>
      <div>
        {searchResults.length > 0 ? (
          <ul className="divide-y divide-light-200 dark:divide-dark-200 p-2 max-h-[80vh] custom-scrollbar overflow-auto transition-all">
            {searchResults.map((result, id) => (
              <Link
                href={'/tool/' + result.slug}
                key={id}
                onClick={() => setShowSearch(false)}>
                <li className="flex items-center gap-4 hover:bg-slate-50 p-2 rounded-xl">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">{result.title}</p>
                    <p className="text-xs text-dark-400">{result.headline}</p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center mt-5">
            <p className="text-sm">No results found</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Search;
