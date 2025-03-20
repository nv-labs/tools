'use client';

import { FC, useState, FormEventHandler, ChangeEvent, useContext } from 'react';
import { Switch } from '@headlessui/react';
import { toast, Toaster } from 'react-hot-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserContext } from '@/context/UserContext';
import { Category } from '@/types/category';
import { Product } from '@/types/product';

type Props = {
  categories: Category[];
  tool: Product;
};

const EditToolPage: FC<Props> = ({ categories, tool }) => {
  const defaultFields = {
    name: tool.title,
    url: tool.link,
    email: tool.email,
    headline: tool.headline ? tool.headline : '',
    description: tool.description ? tool.description : '',
    category: tool.category?.slug,
    isHidden: tool.isHidden,
    discountCode: tool.discountCode ? tool.discountCode : '',
    discountAmount: tool.discountAmount ? tool.discountAmount : '',
  };

  const { user } = useContext(UserContext);
  const [fields, setFields] = useState(defaultFields);
  const [isLoading, setIsLoading] = useState(false);

  const { name, url, email, headline, description, category, isHidden, discountCode, discountAmount } =
    fields;

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });


  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a tool name', {
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    const domain = new URL(url).hostname;
    const updateTime = new Date().toISOString();

    const selectedCategory = categories.find((cat) => cat.slug === category);

    if (user) {
      const result = await fetch(`/api/products?email=${user.email}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: tool.id,
          title: name,
          link: tool.link,
          email: tool.email,
          headline,
          description,
          isHidden,
          category: selectedCategory as Category,
          discountCode,
          discountAmount,
        }),
      });

      if (result.status === 200) {
        toast.success('Tool updated successfully', {
          duration: 5000,
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <main className="max-w-lg mx-auto py-5 px-7">
      <h1 className="text-3xl font-bold">
        Edit tool
      </h1>

      <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm ml-1">
            Tool name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="The name of your tool"
            value={name}
            onChange={handleChange}
            className="w-[100%] px-4 py-3 bg-light-100  rounded outline-none focus:bg-white transition-all focus:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] text-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm ml-1">
          Short Description*
          </label>
          <input
            type="text"
            id="headline"
            name="headline"
            placeholder="Short description of your tool"
            value={headline}
            onChange={handleChange}
            maxLength={150}
            className="w-[100%] px-4 py-3 bg-light-100  rounded outline-none focus:bg-white transition-all focus:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] text-gray-800"
          />
          <label className="text-xs ml-1">
            {150 - headline.length} characters remaining
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm ml-1">
            URL*
          </label>
          <input
            type="text"
            id="url"
            name="url"
            placeholder="https://yourtool.com"
            value={url}
            disabled
            className="w-[100%] px-4 py-3 bg-light-100 rounded outline-none focus:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] cursor-not-allowed text-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm ml-1">
            Category*
          </label>
          <select
            className="w-[100%] pl-4 py-3 bg-light-100 rounded outline-none focus:bg-white transition-all focus:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] border-transparent border-r-[1rem] text-gray-800"
            name="category"
            value={category}
            onChange={handleChange}>
            <option value="default" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm ml-1">
            Discount code
          </label>
          <input
            type="text"
            id="discountCode"
            name="discountCode"
            placeholder="MYOFFERCODE"
            value={discountCode}
            onChange={handleChange}
            className="w-[100%] px-4 py-3 bg-light-100  rounded outline-none focus:bg-white transition-all focus:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] text-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm ml-1">
            Discount amount
          </label>
          <input
            type="text"
            id="discountAmount"
            name="discountAmount"
            placeholder="eg 25% OFF, $100 OFF"
            value={discountAmount}
            onChange={handleChange}
            className="w-[100%] px-4 py-3 bg-light-100  rounded outline-none focus:bg-white transition-all focus:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] text-gray-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm ml-1">
          In one paragraph only, tell users why they should try this tool. (Optional but recommended)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Talk about your tool, what it does, why you built it, etc."
            value={description}
            onChange={handleChange}
            maxLength={250}
            className="w-[100%] h-48 px-4 py-3 bg-light-100 rounded outline-none focus:bg-white transition-all focus:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] resize-none text-gray-800"
          />
          <label className="text-xs ml-1">
            {250 - description.length} characters remaining
          </label>
        </div>

        <Switch.Group>
          <div className="flex items-center justify-between">
            <Switch.Label className="text-gray-500 dark:text-sm">
              Hide listing
            </Switch.Label>
            <Switch
              checked={isHidden}
              onChange={() => setFields({ ...fields, isHidden: !isHidden })}
              className={`${
                isHidden
                  ? 'bg-accent'
                  : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}>
              <span
                className={`${
                  isHidden ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </Switch.Group>

        <button
          className="btn btn-accent btn-wide btn-lg flex gap-2 items-center justify-center"
          disabled={isLoading}>
          {isLoading ? (
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-600 animate-spin fill-light-100"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            'Save changes'
          )}
        </button>
      </form>

      <Toaster />
    </main>
  );
};

export default EditToolPage;
