
import React from "react"

const FilterInput:React.FC =()=>{

    return (
        <details
    className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
  >
    <summary
      className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
    >
      <span className="text-sm font-medium"> Availability </span>

      <span className="transition group-open:-rotate-180">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </span>
    </summary>

    <div className="border-t border-gray-200 bg-white">
      <header className="flex items-center justify-between p-4">
        <span className="text-sm text-gray-700"> 0 Selected </span>

        <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
          Reset
        </button>
      </header>

      <ul className="space-y-1 border-t border-gray-200 p-4">
        <li>
          <label htmlFor="FilterInStock" className="inline-flex items-center gap-2">
            <input type="checkbox" id="FilterInStock" className="size-5 rounded border-gray-300" />

            <span className="text-sm font-medium text-gray-700"> In Stock (5+) </span>
          </label>
        </li>

        <li>
          <label htmlFor="FilterPreOrder" className="inline-flex items-center gap-2">
            <input type="checkbox" id="FilterPreOrder" className="size-5 rounded border-gray-300" />

            <span className="text-sm font-medium text-gray-700"> Pre Order (3+) </span>
          </label>
        </li>

        <li>
          <label htmlFor="FilterOutOfStock" className="inline-flex items-center gap-2">
            <input type="checkbox" id="FilterOutOfStock" className="size-5 rounded border-gray-300" />

            <span className="text-sm font-medium text-gray-700"> Out of Stock (10+) </span>
          </label>
        </li>
      </ul>
    </div>
  </details>
    )
}

export default FilterInput;