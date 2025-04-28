import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function CountryDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
        const data = await res.json();
        const countryData = data[0];
        setCountry(countryData);

        if (countryData.borders && countryData.borders.length > 0) {
          const bordersRes = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${countryData.borders.join(
              ","
            )}`
          );
          const bordersData = await bordersRes.json();
          setBorderCountries(bordersData.map((c) => c.name.common));
        } else {
          setBorderCountries([]);
        }
      } catch (err) {
        console.error("Error loading country:", err);
        navigate("/", { replace: true }); // redirect if not found
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [name, navigate]);

  const getBackgroundColor = () =>
    theme === "light" ? "bg-white" : "bg-gray-900";
  const getTextColor = () =>
    theme === "light" ? "text-gray-900" : "text-white";

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600 dark:text-white">
        Loading country details...
      </div>
    );
  }

  if (!country) return null;

  const countryName = country.name?.common || "N/A";
  const nativeName =
    country.name?.nativeName &&
    Object.values(country.name.nativeName)[0]?.common;
  const currencyList =
    country.currencies && typeof country.currencies === "object"
      ? Object.values(country.currencies)
          .map((cur) => cur.name)
          .join(", ")
      : "N/A";
  const languageList =
    country.languages && typeof country.languages === "object"
      ? Object.values(country.languages).join(", ")
      : "N/A";

  return (
    <div className={`${getBackgroundColor()} min-h-screen ${getTextColor()}`}>
      <header className="w-full shadow-md mb-16 dark:bg-gray-700">
        <div className="flex container mx-auto items-center justify-between px-4">
          <h1 className="font-bold text-xl">Where in the world?</h1>
          <button
            onClick={toggleTheme}
            className="p-2 bg-transparent border-none cursor-pointer"
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      <div className="container mx-auto mb-16 px-4">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-2 shadow-md rounded-lg dark:bg-gray-700 bg-gray-200 text-black dark:text-white"
        >
          ← Back
        </button>
      </div>

      <div className="container flex flex-col md:flex-row mx-auto px-4 gap-12 pb-20">
        <img
          src={country.flags?.png || country.flags?.svg}
          alt={`${countryName} flag`}
          className="md:w-1/2 object-contain max-h-96"
        />
        <div className="md:w-1/2">
          <h2 className="font-bold text-3xl mb-8">{countryName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <p>
              <strong>Native Name:</strong> <span>{nativeName || "N/A"}</span>
            </p>
            <p>
              <strong>Population:</strong>{" "}
              <span>{country.population?.toLocaleString() || "N/A"}</span>
            </p>
            <p>
              <strong>Region:</strong> <span>{country.region || "N/A"}</span>
            </p>
            <p>
              <strong>Sub Region:</strong>{" "}
              <span>{country.subregion || "N/A"}</span>
            </p>
            <p>
              <strong>Capital:</strong>{" "}
              <span>
                {Array.isArray(country.capital)
                  ? country.capital[0]
                  : country.capital || "N/A"}
              </span>
            </p>
            <p>
              <strong>Top Level Domain:</strong>{" "}
              <span>{country.tld?.[0] || "N/A"}</span>
            </p>
            <p>
              <strong>Currencies:</strong> <span>{currencyList}</span>
            </p>
            <p>
              <strong>Languages:</strong> <span>{languageList}</span>
            </p>
          </div>

          {/* Border Countries */}
          <div className="mt-10">
            <span className="font-bold mr-2">Bordering Countries:</span>
            {borderCountries.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {borderCountries.map((borderName) => (
                  <button
                    key={borderName}
                    onClick={() => navigate(`/country/${borderName}`)}
                    className="px-4 py-1 shadow rounded-md text-sm bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    {borderName}
                  </button>
                ))}
              </div>
            ) : (
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                None
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryDetails;
