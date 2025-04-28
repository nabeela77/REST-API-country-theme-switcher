import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Ensure the correct path to the ThemeContext
import CountryCard from "../components/CountryCard";

function Home() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState("");

  // Access theme context
  const { theme, toggleTheme } = useTheme();

  // Functions for dynamic background and text colors based on theme
  const getBackgroundColor = () =>
    theme === "light" ? "bg-white" : "bg-gray-900";
  const getTextColor = () =>
    theme === "light" ? "text-gray-900" : "text-white";

  // Fetch all countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        setCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Filter countries based on search and region
  const filteredCountries = countries.filter((country) => {
    const name = country.name?.common?.toLowerCase() || "";
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const matchesRegion = region
      ? country.region.toLowerCase() === region
      : true;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className={`${getBackgroundColor()}  min-h-screen ${getTextColor()}`}>
      {/* Header */}
      <header className="w-full shadow-md mb-16 dark:bg-gray-700">
        <div className="flex container mx-auto items-center justify-between">
          <h1 className="font-bold text-xl" aria-label="Where in the world?">
            Where in the world?
          </h1>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            className="p-2 bg-transparent border-none cursor-pointer"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      {/* Search + Filter */}
      <div className="container mx-auto mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="🔎 Search for a country..."
              className="pl-10 p-2 w-full shadow-md rounded-md dark:bg-gray-700 dark:text-white"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              aria-label="Search for a country by name"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            className="p-2 shadow-md rounded-md font-medium dark:bg-gray-700 dark:text-white w-full sm:w-auto"
            onChange={(e) => setRegion(e.target.value)}
            aria-label="Filter countries by region"
          >
            <option value="">Filter by Region</option>
            <option value="africa">Africa</option>
            <option value="americas">America</option>
            <option value="asia">Asia</option>
            <option value="europe">Europe</option>
            <option value="oceania">Oceania</option>
          </select>
        </div>
      </div>

      {/* Country Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 px-20">
        {filteredCountries.map((country, index) => (
          <Link
            key={index}
            to={`/country/${encodeURIComponent(
              country.name?.common || "unknown"
            )}`}
            state={country}
            aria-label={`View details for ${country.name?.common}`}
          >
            <CountryCard
              title={country.name?.common}
              image_url={country.flags?.png || country.flags?.svg}
              population={country.population}
              region={country.region}
              capital={
                Array.isArray(country.capital)
                  ? country.capital[0]
                  : country.capital
              }
              textColor={getTextColor()}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
