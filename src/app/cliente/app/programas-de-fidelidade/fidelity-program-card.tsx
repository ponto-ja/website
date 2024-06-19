import { FC } from 'react';
import Link from 'next/link';
import { formatScoreRate } from '@/helpers/format-score-rate';
import { Gift } from 'lucide-react';
import { createSlug } from '@/helpers/create-slug';

type FidelityProgramCardProps = {
  id: string;
  name: string;
  scoreRate: number;
  createdAt: string;
};

export const FidelityProgramCard: FC<FidelityProgramCardProps> = ({
  id,
  name,
  scoreRate,
  createdAt,
}) => {
  const href = '/cliente/app/programas-de-fidelidade/'.concat(
    createSlug(name).concat('--').concat(id),
  );

  return (
    <Link href={href}>
      <div className="rounded border w-[360px] p-5 cursor-pointer hover:border-violet-900 max-[400px]:w-[calc(100vw-1rem)]">
        <div className="w-full flex items-start justify-between mb-6">
          <p className="font-inter font-medium text-[18px] text-gray-700">{name}</p>
          <Gift color="#374151" strokeWidth={1.8} />
        </div>
        <p className="font-inter font-normal text-base text-gray-700">
          {formatScoreRate(scoreRate)} em compra = +1 ponto
        </p>
        <p className="font-inter font-normal text-base text-gray-600 mt-1">
          Criado em {createdAt}
        </p>
      </div>
    </Link>
  );
};
