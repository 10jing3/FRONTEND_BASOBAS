import React, { useState, useEffect } from "react";
import axios from "axios";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "room rental",
            apiKey: "f3e497ac3cbf46af94bb2d91213b8888",
          },
        });
        setNews(response.data.articles);
      } catch (err) {
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <main className="container mx-auto my-10 px-4 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        Latest Room Rental News
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-medium text-gray-500 animate-pulse">
            Loading news...
          </p>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 bg-red-100 p-4 rounded shadow">
          <p>{error}</p>
        </div>
      ) : news.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <li
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 overflow-hidden"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description || "No description available."}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-green-600 hover:underline font-medium"
                >
                  Read more
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 font-medium">
          <p>No news articles found on this topic.</p>
        </div>
      )}
    </main>
  );
};

export default News;
