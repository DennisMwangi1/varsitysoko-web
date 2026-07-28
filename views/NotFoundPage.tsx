import React from 'react';
import type { ViewState } from '../App';
import { Button, BrandMark } from '../components/UI';

const NotFoundPage: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 sm:py-32 text-center flex flex-col items-center">
      <BrandMark className="w-20 h-20 opacity-90 mb-8" />
      <p className="text-6xl font-extrabold text-ink dark:text-white tnums heading">404</p>
      <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-ink dark:text-white tracking-tight heading">
        This stall isn’t here.
      </h1>
      <p className="mt-4 text-base text-slate-500 dark:text-slate-400 max-w-md">
        The page you’re looking for doesn’t exist or has moved. Let’s get you back to the marketplace.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button variant="primary" className="py-3 px-7" onClick={() => onNavigate('landing')}>Back to home</Button>
        <Button variant="outline" className="py-3 px-7" onClick={() => onNavigate('download')}>Join waitlist</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
