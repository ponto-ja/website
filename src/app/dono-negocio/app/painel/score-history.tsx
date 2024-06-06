export const ScoreHistory = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-violet-200 rounded-full w-10 h-10 flex items-center justify-center">
          <p className="font-inter font-medium text-gray-500 text-base">JD</p>
        </div>
        <div>
          <p className="font-inter font-medium text-gray-700 text-base">John Doe</p>
          <p className="font-inter font-normal text-sm text-gray-600">(99) 99999-9999</p>
        </div>
      </div>
      <div className="flex items-center gap-4 max-[500px]:flex-col max-[500px]:items-end max-[500px]:gap-1">
        <p className="font-inter font-medium text-sm text-green-600 bg-green-200 py-1 px-[6px] rounded">
          +100 pontos
        </p>
        <p className="font-inter font-normal text-sm text-gray-500">04/05/2024</p>
      </div>
      {/* <div className="flex items-center gap-4">
        <p className="font-inter font-medium text-sm text-red-600 bg-red-200 py-1 px-[6px] rounded">
          -10 pontos
        </p>
        <p className="font-inter font-normal text-sm text-gray-500">04/05/2024</p>
      </div> */}
    </div>
  );
};
