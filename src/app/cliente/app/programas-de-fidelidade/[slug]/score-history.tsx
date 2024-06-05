export const ScoreHistory = () => {
  return (
    <div className="w-full flex items-center justify-between rounded border-[1px] border-transparent hover:border-violet-900 p-1">
      <p className="font-inter font-normal text-sm text-gray-500">1. 04/05/2024</p>
      <p className="font-inter font-medium text-sm text-green-600 bg-green-200 py-1 px-[6px] rounded">
        +100 pontos
      </p>
      {/* <div className="flex items-center gap-4">
        <p className="font-inter font-medium text-sm text-red-600 bg-red-200 py-1 px-[6px] rounded">
          -10 pontos
        </p>
        <p className="font-inter font-normal text-sm text-gray-500">04/05/2024</p>
      </div> */}
    </div>
  );
};
