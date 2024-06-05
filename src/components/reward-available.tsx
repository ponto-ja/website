import { ComponentProps, FC } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type RewardAvailableProps = {
  selected?: boolean;
  className?: ComponentProps<'div'>['className'];
};

export const RewardAvailable: FC<RewardAvailableProps> = ({
  selected = false,
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx('w-full border-[1px] rounded px-3 py-2', {
          'border-violet-700': selected,
          'border-gray-200': !selected,
        }),
        className,
      )}>
      <p className="font-inter font-semibold text-gray-700">
        Desconto de 50% na próxima compra
      </p>
      <p className="font-inter font-normal text-sm text-gray-500 my-2">
        Pontuação necessária: 100
      </p>
      <p className="font-inter font-normal text-sm text-gray-500">
        Breve descrição sobre a recompensa ...
      </p>
    </div>
  );
};
