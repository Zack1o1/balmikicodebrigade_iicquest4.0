import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock,
  ArrowRight,
  Star,
  FileText,
  IndianRupee,
} from "lucide-react";
import SERVICES from "../data/services";

const ServiceDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const items = SERVICES;
  const categories = ["All", ...Array.from(new Set(items.map((s) => s.category)))];

  const filteredServices = items.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.nameNep || "").includes(searchQuery) ||
      service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 bg-[#021330] bg-gradient-to-br from-[#06183e] via-[#01255d] to-[#120a2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Service Directory
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Browse and apply for municipal services online. Find required
            documents, processing times, and fees.
          </p>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
              <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl leading-5 bg-transparent placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-lg transition-shadow shadow-sm hover:shadow-md"
              placeholder="Search services (e.g., Birth Registration, विवाह दर्ता)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === category
                          ? "bg-blue-50 text-primary-blue"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {category}
                      {category !== "All" && (
                        <span className="float-right bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full text-xs">
                          {items.filter((i) => i.category === category).length}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            {filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No services found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden flex flex-col transition-all duration-200 group"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        {service.popular && (
                          <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full border border-yellow-200">
                            <Star size={12} fill="currentColor" /> Popular
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <p className="text-primary-blue font-medium mb-3">
                        {service.nameNep}
                      </p>

                      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                        {service.desc}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{service.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{service.docs} docs required</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{service.fee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {service.category}
                      </span>
                      <Link to={`/apply/${service.id}`} className="text-white bg-primary-red p-2 rounded-2xl font-medium text-sm inline-flex items-center gap-1 hover:bg-opacity-90">
                        Apply Now
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDirectory;
