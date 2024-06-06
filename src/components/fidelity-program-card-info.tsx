import { ComponentProps, ComponentType, FC } from 'react';
import { twMerge } from 'tailwind-merge';

type FidelityProgramCardInfoProps = {
  title: string;
  icon: ComponentType<Record<string, unknown>>;
  value: string;
  description: string;
  className?: ComponentProps<'div'>['className'];
};

export const FidelityProgramCardInfo: FC<FidelityProgramCardInfoProps> = ({
  title,
  icon: Icon,
  value,
  description,
  className,
}) => {
  return (
    <div className={twMerge('rounded border w-full p-5', className)}>
      <div className="w-full flex items-center justify-between">
        <p className="font-inter font-medium text-base text-gray-700">{title}</p>
        <Icon color="#374151" strokeWidth={1.8} />
      </div>
      <p className="font-inter font-semibold text-2xl text-gray-700 mt-4 max-[1000px]:text-xl">
        {value}
      </p>
      <p className="font-inter font-normal text-sm text-gray-600">{description}</p>
    </div>
  );
};
