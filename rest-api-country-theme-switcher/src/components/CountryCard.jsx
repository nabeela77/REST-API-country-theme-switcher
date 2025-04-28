import React from "react";

function CountryCard({ title, image_url, population, region, capital }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md dark:bg-gray-700 text:white hover:shadow-xl transition-all">
      <img src={image_url} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className={`font-bold text-lg mb-2`}>{title}</h2>
        <p className={`text-sm`}>
          <strong>Population:</strong> {population.toLocaleString()}
        </p>
        <p className={`text-sm `}>
          <strong>Region:</strong> {region}
        </p>
        <p className={`text-sm `}>
          <strong>Capital:</strong> {capital}
        </p>
      </div>
    </div>
  );
}

export default CountryCard;
