export const Participant = () => {
  return (
    <div className="w-full flex items-center justify-between rounded p-1 border-[1.5px] border-transparent hover:border-violet-900 transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-2">
        <div className="bg-violet-200 rounded-full w-10 h-10 flex items-center justify-center">
          <p className="font-inter font-medium text-gray-500 text-base">JD</p>
        </div>
        <div>
          <p className="font-inter font-medium text-gray-700 text-base text-left">
            John Doe
          </p>
          <p className="font-inter font-normal text-sm text-gray-600">(99) 99999-9999</p>
        </div>
      </div>
      <p className="font-inter font-normal text-sm text-gray-500">Desde 04/05/2024</p>
    </div>
  );
};
