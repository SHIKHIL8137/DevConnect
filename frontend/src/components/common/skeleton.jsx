export const SkeletonCard = () => (
  <div className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
      <div>
        <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-20"></div>
  </div>
);

export const verifyClientSkeleton =()=>{
  return(
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
  <div className="bg-white rounded-xl shadow-sm">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4"></div>
          <div>
            <div className="h-5 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="flex space-x-4">
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>

    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="h-5 w-40 bg-gray-300 mb-4 rounded"></div>
        <div className="space-y-4">
          {Array(4).fill().map((_, i) => (
            <div className="flex items-start" key={i}>
              <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 mr-3"></div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-48 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="h-5 w-40 bg-gray-300 mb-4 rounded"></div>
        <div className="space-y-4">
          {Array(3).fill().map((_, i) => (
            <div className="flex items-start" key={i}>
              <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 mr-3"></div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-48 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="p-6 border-t border-gray-200">
      <div className="h-5 w-40 bg-gray-300 mb-4 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3).fill().map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
  )
}