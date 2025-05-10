import { useState } from "react";
import { Star, ChevronDown, Filter, Search, MessageSquare } from "lucide-react";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";

const FreelancerListing = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const freelancers = [
    {
      id: 1,
      title: "E-commerce Redesign",
      description:
        "Complete redesign of an e-commerce platform using React and Tailwind CSS",
      price: "100000",
      skills: ["React", "NodeJS", "MongoDB", "HTML"],
    },
    {
      id: 2,
      title: "E-commerce Redesign",
      description:
        "Complete redesign of an e-commerce platform using React and Tailwind CSS",
      price: "100000",
      skills: ["React", "NodeJS", "MongoDB", "HTML"],
    },
    {
      id: 3,
      title: "E-commerce Redesign",
      description:
        "Complete redesign of an e-commerce platform using React and Tailwind CSS",
      price: "100000",
      skills: ["React", "NodeJS", "MongoDB", "HTML"],
    },
    {
      id: 4,
      title: "E-commerce Redesign",
      description:
        "Complete redesign of an e-commerce platform using React and Tailwind CSS",
      price: "100000",
      skills: ["React", "NodeJS", "MongoDB", "HTML"],
    },
  ];

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Full Stack",
    "DevOps",
    "Mobile",
    "UI/UX",
  ];
  const budgetRanges = ["0 - 10000", "10000 - 50000", "50000 - 100000"];

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 px-4 py-8">
        <Navbar />
        <div className="text-center max-w-3xl mx-auto mt-30">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Find the Perfect Your Project
          </h1>
          <p className="text-white text-lg md:text-xl mb-8 opacity-90">
            Connect with skilled professionals specializing in development,
            design, and IT solutions
          </p>

          <div className="flex flex-col sm:flex-row w-full max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by skill, role or keyword..."
                className="block w-full pl-10 pr-3 py-4 rounded-lg sm:rounded-r-none border-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <button className="mt-3 sm:mt-0 bg-blue-700 hover:bg-blue-800 text-white font-medium py-4 px-8 rounded-lg sm:rounded-l-none transition duration-300">
              Search
            </button>
          </div>
        </div>

        {/* Chat button */}
        <div className="absolute bottom-6 right-6">
          <button className="bg-white text-blue-600 rounded-full p-4 shadow-lg hover:bg-blue-50 transition-colors">
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden bg-white p-4 sticky top-0 z-10 shadow-sm">
          <button
            onClick={toggleMobileFilter}
            className="flex items-center justify-between w-full px-4 py-2 text-left bg-gray-100 rounded-md"
          >
            <div className="flex items-center">
              <Filter size={18} className="mr-2" />
              <span>Filters</span>
            </div>
            <ChevronDown
              size={18}
              className={`transform transition-transform ${
                isMobileFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filters Sidebar */}
        <div
          className={`${
            isMobileFilterOpen ? "block" : "hidden"
          } md:block bg-white p-6 shadow-sm md:w-64 md:min-w-64 h-full md:sticky md:top-0`}
        >
          <div className="flex items-center mb-6">
            <Filter size={18} className="mr-2" />
            <h2 className="text-lg font-medium">Filters</h2>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md cursor-pointer ${
                    category === "All"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <h3 className="font-medium mb-3">Budget</h3>
            <div className="space-y-2">
              {budgetRanges.map((range, index) => (
                <div
                  key={index}
                  className="p-2 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  {range}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">
              Available Freelancers
            </h1>

            {/* Sort dropdown */}
            <div className="relative">
              <div className="flex items-center border rounded-md px-4 py-2">
                <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                <span className="text-sm font-medium">Highest Rated</span>
                <ChevronDown size={16} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Freelancers Grid */}
          <div className="space-y-4">
            {freelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                      <div className="w-full h-full bg-gray-400 rounded-full"></div>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {freelancer.title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {freelancer.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {freelancer.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <p className="text-lg font-bold">{freelancer.price} /-</p>

                    <div className="flex gap-2 mt-4 justify-start md:justify-end">
                      <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md">
                        Details
                      </button>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FreelancerListing;
