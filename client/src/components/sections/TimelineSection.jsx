import React from 'react';

const TimelineSection = () => {
  const timelineData = [
    {
      year: '1999',
      title: 'The Beginning',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/api/placeholder/300/200',
      position: 'left'
    },
    {
      year: '2003',
      title: 'Growth Period',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: '/api/placeholder/300/200',
      position: 'right'
    },
    {
      year: '2015',
      title: 'Expansion Era',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      image: '/api/placeholder/300/200',
      position: 'left'
    },
    {
      year: 'Now',
      title: 'Present Day',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: '/api/placeholder/300/200',
      position: 'right'
    }
  ];

  return (
    <section className="bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          (UMKM's) Timeline
        </h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 hidden md:block"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <div 
                key={index}
                className={`relative flex items-center ${
                  item.position === 'left' 
                    ? 'md:flex-row-reverse md:justify-start' 
                    : 'md:flex-row md:justify-end'
                } flex-col`}
              >
                {/* Content Side */}
                <div className={`w-full md:w-5/12 ${
                  item.position === 'left' ? 'md:pl-12' : 'md:pr-12'
                }`}>
                  {item.position === 'left' ? (
                    // Left Side - Image
                    <div className="rounded-lg overflow-hidden shadow-xl">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ) : (
                    // Right Side - Text Content
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center Point */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                  <div className="relative">
                    {/* Year Badge */}
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg whitespace-nowrap">
                      {item.year}
                    </div>
                    {/* Circle Connector */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full border-4 border-gray-900"></div>
                  </div>
                </div>

                {/* Opposite Side */}
                <div className={`w-full md:w-5/12 mt-4 md:mt-0 ${
                  item.position === 'left' ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  {item.position === 'left' ? (
                    // Left Side - Text Content
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ) : (
                    // Right Side - Image
                    <div className="rounded-lg overflow-hidden shadow-xl">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Mobile Year Badge */}
                <div className="md:hidden mt-4 mb-2">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm inline-block shadow-lg">
                    {item.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;