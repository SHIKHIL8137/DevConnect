import { useState } from "react";
import { Star, ChevronDown, Filter, Search, MessageSquare } from "lucide-react";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";

const FreelancerMarketplace = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const freelancers = [
    {
      id: 1,
      name: "Alex Johnson",
      title: "Full Stack Developer",
      rating: 4.9,
      hourlyRate: 75,
      skills: ["React", "Node.js", "MongoDB", "HTML"],
    },
    {
      id: 2,
      name: "Alex Johnson",
      title: "Full Stack Developer",
      rating: 4.9,
      hourlyRate: 75,
      skills: ["React", "Node.js", "MongoDB", "HTML"],
    },
    {
      id: 3,
      name: "Alex Johnson",
      title: "Full Stack Developer",
      rating: 4.9,
      hourlyRate: 75,
      skills: ["React", "Node.js", "MongoDB", "HTML"],
    },
    {
      id: 4,
      name: "Alex Johnson",
      title: "Full Stack Developer",
      rating: 4.9,
      hourlyRate: 75,
      skills: ["React", "Node.js", "MongoDB", "HTML"],
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

  const hourlyRates = ["$0 - $50", "$50 - $100", "$100 - $150", "$150+"];

  const experienceLevels = ["Entry", "Intermediate", "Expert"];

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 px-4 py-8">
        <Navbar />
        <div className="text-center max-w-3xl mx-auto mt-30">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Find the Perfect IT Freelancer for Your Project
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

        <div className="absolute bottom-6 right-6">
          <button className="bg-white text-blue-600 rounded-full p-4 shadow-lg hover:bg-blue-50 transition-colors">
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center justify-center w-full bg-white p-3 rounded-lg shadow text-gray-700"
              >
                <Filter size={20} className="mr-2" />
                <span>Filters</span>
                <ChevronDown
                  size={20}
                  className={`ml-2 transition-transform ${
                    mobileFiltersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div
              className={`lg:w-1/4 pr-0 lg:pr-6 ${
                mobileFiltersOpen ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white p-5 rounded-lg shadow mb-4">
                <div className="font-medium text-gray-800 mb-4 flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filters
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                  <ul>
                    {categories.map((category) => (
                      <li
                        key={category}
                        className={`py-2 px-3 mb-1 rounded-md cursor-pointer hover:bg-gray-100 ${
                          category === "All" ? "bg-blue-100 text-blue-600" : ""
                        }`}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Hourly Rate
                  </h3>
                  <ul>
                    {hourlyRates.map((rate) => (
                      <li
                        key={rate}
                        className="py-2 px-3 mb-1 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        {rate}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Experience Level
                  </h3>
                  <ul>
                    {experienceLevels.map((level) => (
                      <li
                        key={level}
                        className="py-2 px-3 mb-1 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        {level}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Available Freelancers
                </h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2 hidden sm:inline">
                    Sort by:
                  </span>
                  <div className="relative">
                    <select className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                      <option>Highest Rated</option>
                      <option>Lowest Rate</option>
                      <option>Highest Rate</option>
                      <option>Most Relevant</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {freelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 mr-4">
                          <div className="w-full h-full bg-gray-400 rounded-full"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">
                            {freelancer.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {freelancer.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star
                              size={16}
                              className="text-yellow-400 fill-current"
                            />
                            <span className="ml-1 text-sm">
                              {freelancer.rating}/5.0
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 text-right">
                        <p className="font-bold text-xl">
                          ${freelancer.hourlyRate}/hr
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {freelancer.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="border-t mt-6 pt-4 flex justify-end">
                      <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FreelancerMarketplace;
