'use client';

import { FC, FormEventHandler, ChangeEvent, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Modal from './modal';

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

const defaultUserInfo = {
  email: '',
};

const SignIn: FC<Props> = ({ showModal, setShowModal }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [emailSent, setEmailSent] = useState(false);

  const { email } = userInfo;

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!email || emailSent) return;

    setError('');
    setLoading(true);

    let { data, error } = await supabase.auth.signInWithOtp({
      email,
    });

    setUserInfo(defaultUserInfo);
    setLoading(false);

    if (error) return setError(error.message);

    setEmailSent(true);
  };

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      className="max-w-[400px] py-5 px-7 pb-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Sign In
      </h1>

      <form className="mt-4 grid gap-2" onSubmit={handleSubmit}>
        <div className="relative">
          <label
            htmlFor="email"
            className="absolute top-0 left-0 flex items-center h-full px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-800">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            disabled={emailSent}
            placeholder="Your email"
            className={`w-[100%] px-4 pl-12 py-3 bg-light-100 rounded outline-none focus:bg-white transition-all focus:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)]  text-gray-800${
              emailSent ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <button
          className="px-2 py-4 mt-4 rounded w-full flex gap-2 justify-center bg-black text-white"
          disabled={emailSent || loading}>
          {loading ? (
            <div role="status" className="flex items-center gap-2">
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
            </div>
          ) : !emailSent ? (
            'Sign In'
          ) : (
            <div className="flex items-center gap-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1.25em"
                width="1.25em"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
              </svg>
              Check your email
            </div>
          )}
        </button>

        {error && <p className="text-red-600 text-center mt-3">{error}</p>}
      </form>
    </Modal>
  );
};

export default SignIn;
