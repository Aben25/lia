'use client';

interface Prop {
  activeMode: 'email' | 'phone';
  onChange: (mode: 'email' | 'phone') => void;
}

export default function AuthModeSelector({ activeMode, onChange }: Prop) {
  return (
    <div className="relative flex items-center justify-center mx-auto w-64 h-12 rounded-full bg-gray-100 p-1">
      {/* Sliding background */}
      <div
        className={`absolute top-1 transition-all duration-300 ease-in-out h-10 w-32 bg-white rounded-full shadow-md ${
          activeMode === 'email' ? 'left-1' : 'left-[calc(50%_-_4px)]'
        }`}
      ></div>

      {/* Email Option */}
      <button
        type="button"
        className={`relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
          activeMode === 'email'
            ? 'text-indigo-600 font-semibold'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChange('email')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`mr-2 h-4 w-4 ${activeMode === 'email' ? 'text-indigo-600' : 'text-gray-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Email
      </button>

      {/* Phone Option */}
      <button
        type="button"
        className={`relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
          activeMode === 'phone'
            ? 'text-indigo-600 font-semibold'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onChange('phone')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`mr-2 h-4 w-4 ${activeMode === 'phone' ? 'text-indigo-600' : 'text-gray-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        Phone
      </button>
    </div>
  );
}
