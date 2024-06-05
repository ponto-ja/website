import { FC } from 'react';
import clsx from 'clsx';

type RewardAvailableProps = {
  selected: boolean;
};

export const RewardAvailable: FC<RewardAvailableProps> = ({ selected }) => {
  return (
    <div
      className={clsx('w-full border-[1px]  rounded px-3 py-2', {
        'border-violet-700': selected,
        'border-gray-200': !selected,
      })}>
      <p className="font-inter font-semibold text-gray-700">
        Desconto de 50% na próxima compra
      </p>
      <p className="font-inter font-normal text-sm text-gray-500 mt-2">
        Pontuação necessária: 100
      </p>
    </div>
  );
};
