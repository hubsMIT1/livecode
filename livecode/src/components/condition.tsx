import React, { useState } from 'react';

const AgreementPage: React.FC = () => {
  const [agreed, setAgreed] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(event.target.checked);
  };

  return (
    <div className="max-w-lg p-6">
      <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Agreement</h1>
      <p className="mb-4">
        Please read the following terms and conditions carefully before proceeding:
      </p>
      <article className="text-wrap">
  <h3>Beloved Manhattan soup stand closes</h3>
  <p>New Yorkers are facing the winter chill...</p>
</article>
      <ul className="list-disc pl-6 mb-4">
        <li>Term 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Term 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
        <li>Term 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</li>
      </ul>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="agree-checkbox"
          checked={agreed}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        <label htmlFor="agree-checkbox" className="text-sm">
          I agree to the terms and conditions
        </label>
      </div>
      {agreed && (
        <p className="bg-green-100 text-green-800 px-4 py-2 rounded">
          Thank you for agreeing to the terms and conditions!
        </p>
      )}
    </div>
  );
};

export default AgreementPage;