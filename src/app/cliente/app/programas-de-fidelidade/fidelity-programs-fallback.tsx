import { PackageX } from 'lucide-react';

export const FidelityProgramsFallback = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center gap-2 mt-[100px]">
      <PackageX color="#374151" size={50} strokeWidth={1.3} />
      <h2 className="text-center font-inter font-medium text-base text-gray-700">
        Você não participa de programas de fidelidade ainda.
      </h2>
    </div>
  );
};
