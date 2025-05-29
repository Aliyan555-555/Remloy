// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const HomePage = () => {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Implement search logic here
  };

  // Featured remedies data
  const featuredRemedies = [
    {
      id: "1",
      title: "Turmeric Tea",
      description: "Help with inflammation",
      image: "/images/remedies/turmeric-tea.jpg",
      category: "Trending",
    },
    {
      id: "2",
      title: "Custom Blend #1",
      description: "AI Confidence 95%",
      image: "/images/remedies/custom-blend.jpg",
      category: "AI Picks",
    },
    {
      id: "3",
      title: "ElderBerry Mix",
      description: "Immune Support",
      image: "/images/remedies/elderberry.jpg",
      category: "New Arrival",
    },
  ];

  // Categories data
  const categories = [
    {
      id: "1",
      title: "Community Remedies",
      description: "Tried and tested by real users",
      image: "/images/categories/community.jpg",
    },
    {
      id: "2",
      title: "Alternative Remedies",
      description: "Holistic & natural healing approaches",
      image: "/images/categories/alternative.jpg",
    },
    {
      id: "3",
      title: "Pharmaceutical Remedies",
      description: "Doctor approved medication solutions",
      image: "/images/categories/pharmaceutical.jpg",
    },
    {
      id: "4",
      title: "AI Remedies",
      description: "AI-powered custom treatment suggestions",
      image: "/images/categories/ai.jpg",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: "1",
      name: "Stephene Cena",
      quote:
        "People are loving how AI can personalize natural remedies to fit their needs.",
      image: "/images/testimonials/person1.jpg",
    },
    {
      id: "2",
      name: "Monica Johnson",
      quote:
        "AI-powered remedies are changing the way we approach natural healing.",
      image: "/images/testimonials/person2.jpg",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* AI Banner */}
      <div className="bg-brand-green text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <span>🌿 AI-Powered Remedy Recommendations Available!</span>
        </div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Banner */}

      <div className="relative">
        <img
          src="/images/hero-banner.jpg"
          alt="Remlyo Hero Banner"
          className="w-full h-[800px] object-cover"
        />

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="max-w-xl text-black">
              <div className="flex items-center mb-2">
                <img
                  src="/images/logo-white.png"
                  alt="Remlyo"
                  className="h-15 mr-2"
                />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Natural Remedies
                <br />
                <span className="text-brand-green">Powered by AI</span>
              </h1>

              <p className="mb-6">
                Personalized, AI-driven natural treatments backed by community
                wisdom & success data
              </p>
              <div className="md:w-1/2 flex justify-center">
                <Button
                  variant="contained"
                  size="large"
                  color="brand"
                  to="/remedies"
                >
                  Explore Remedies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative -mt-2 mb-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center">
              <div className="w-full">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Redesigned with better styling */}
      <section className="bg-brand-green text-white py-10 mb-12 rounded-lg mx-auto max-w-5xl">
        {" "}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {" "}
            <div className="text-center border-r border-green-400">
              {" "}
              <div className="text-4xl font-bold mb-2">1K+</div>{" "}
              <div className="text-sm font-medium">Natural Remedies</div>
            </div>
            <div className="text-center border-r border-green-400">
              {" "}
              <div className="text-4xl font-bold mb-2">7K+</div>{" "}
              <div className="text-sm font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">85%</div>{" "}
              <div className="text-sm font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Remedies Section */}
      <section className="mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">
            Featured Remedies
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Display trending remedies with AI confidence scores and most
            effective remedies
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRemedies.map((remedy) => (
              <div
                key={remedy.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={remedy.image}
                    alt={remedy.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=" +
                        remedy.title;
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-brand-green text-white px-3 py-1 rounded-full text-xs">
                    {remedy.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{remedy.title}</h3>
                  <p className="text-sm text-gray-600">{remedy.description}</p>
                  <Button variant="readMore" className="mt-3">
                    Read More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse By Category */}
      <section className="mb-16 bg-yellow-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Browse By Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="text-center">
                <div className="mb-3">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-36 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=" +
                        category.title;
                    }}
                  />
                </div>
                <h3 className="font-semibold">{category.title}</h3>
                <p className="text-xs text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === 3 ? "bg-brand-green" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            What People Are Saying
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mb-4 flex justify-center">
                <img
                  src="/images/testimonials/person1.jpg"
                  alt="Stephene Cena"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/96";
                  }}
                />
              </div>
              <h3 className="font-semibold text-lg">Stephene Cena</h3>
              <p className="text-gray-600 mt-2">
                People are loving how AI can personalize natural remedies to fit
                their needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mb-4 flex justify-center">
                <img
                  src="/images/testimonials/person2.jpg"
                  alt="Monica Johnson"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/96";
                  }}
                />
              </div>
              <h3 className="font-semibold text-lg">Monica Johnson</h3>
              <p className="text-gray-600 mt-2">
                AI-powered remedies are changing the way we approach natural
                healing.
              </p>
            </div>
          </div>

          {/* Pagination Dots with Divider */}
          <div className="flex justify-center items-center mt-12">
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex space-x-2 mx-4">
              <div className="w-2 h-2 rounded-full bg-brand-green"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Natural Health Journey
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join thousands discovering AI-powered natural healing. Sign up now
            for free access to top remedies!
          </p>
          <Button variant="contained" color="brand" size="large" to="/signup">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
