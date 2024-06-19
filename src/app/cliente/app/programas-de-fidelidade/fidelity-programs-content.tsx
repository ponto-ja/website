'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FidelityProgramCard } from './fidelity-program-card';
import { FidelityProgramsFallback } from './fidelity-programs-fallback';
import { useUserStore } from '@/store/user-store';
import { useFidelityProgram } from '@/hooks/use-fidelity-program';
import { PageLoading } from '@/components/page-loading';
import { useToast } from '@/components/ui/toast/use-toast';
import { FidelityProgramData } from '@/@types/fidelity-program-data';

export const FidelityProgramsContent = () => {
  const { toast } = useToast();
  const { user } = useUserStore();
  const { findByParticipantId, isLoadingFindByParticipantId } = useFidelityProgram({
    initialState: {
      isLoadingFindByParticipantId: true,
    },
  });
  const [showFallback, setShowFallback] = useState(false);
  const [fidelityPrograms, setFidelityPrograms] = useState<FidelityProgramData[]>([]);

  const handleFetchFidelityPrograms = async () => {
    const { code, data } = await findByParticipantId(user.id!);

    switch (code) {
      case 'FOUND_FIDELITY_PROGRAMS': {
        setFidelityPrograms(data!);
        break;
      }

      case 'NOT_FOUND_FIDELITY_PROGRAMS': {
        setShowFallback(true);
        break;
      }

      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description: 'Houve um erro no carregamento dos dados, recarregue a página.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  useEffect(() => {
    if (user.id !== null) {
      handleFetchFidelityPrograms();
    }
  }, [user]);

  if (showFallback) return <FidelityProgramsFallback />;

  return (
    <PageLoading isLoading={isLoadingFindByParticipantId}>
      <div className="w-full">
        <div>
          <div className="flex items-center gap-3">
            <Sparkles color="#374151" size={30} strokeWidth={1.7} />
            <h2 className="font-inter font-bold text-[26px] text-gray-700 max-[600px]:text-[22px]">
              Programas de Fidelidade
            </h2>
          </div>
          <p className="font-inter font-normal text-sm text-gray-700">
            Programas de fidelidade que você está participando
          </p>
        </div>

        <div className="w-full mt-4 flex items-center gap-4 flex-wrap">
          {fidelityPrograms.map((fidelityProgram) => (
            <FidelityProgramCard key={fidelityProgram.id} {...fidelityProgram} />
          ))}
        </div>
      </div>
    </PageLoading>
  );
};
