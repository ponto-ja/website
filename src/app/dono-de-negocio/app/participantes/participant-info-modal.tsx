'use client';

import { FC, useEffect, useState } from 'react';
import { UserRound, Phone, CalendarClock, CircleAlert, HandCoins } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/button';
import { Participant } from './participant';
import { Reward } from '@/components/reward';
import { Participant as ParticipantProps } from './participants-content';
import { mask } from '@/helpers/mask';
import { useScore } from '@/hooks/use-score';
import { useToast } from '@/components/ui/toast/use-toast';
import { Oval } from 'react-loader-spinner';
import { RewardData } from '@/@types/reward-data';

type ParticipantInfoModalProps = {
  participant: ParticipantProps;
  rewards: RewardData[];
};

export const ParticipantInfoModal: FC<ParticipantInfoModalProps> = ({
  participant,
  rewards,
}) => {
  const { toast } = useToast();
  const { getByParticipantId, isLoadingGetByParticipantId } = useScore();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);

  const hasSufficientScore =
    score === null ? true : rewards.some((reward) => reward.scoreNeeded <= score);

  const handleFetchScore = async () => {
    const { code, data } = await getByParticipantId(participant.id);

    switch (code) {
      case 'SCORE_FOUND': {
        setScore(data!.score);
        break;
      }

      case 'SCORE_NOT_FOUND':
      case 'UNEXPECTED_ERROR': {
        toast({
          title: 'Ops! Erro inesperado :(',
          description:
            'Houve um erro ao buscar os pontos do participante, tente novamente.',
          variant: 'destructive',
          titleClassName: 'text-white',
          descriptionClassName: 'text-white',
        });
        break;
      }
    }
  };

  const handleSelectReward = (reward: RewardData) => {
    if (!hasSufficientScore) return;

    if (reward.id === selectedRewardId) {
      setSelectedRewardId(null);
      return;
    }

    if (reward.scoreNeeded <= score!) {
      setSelectedRewardId(reward.id);
    }
  };

  //TODO: * [ VALIDAR SE DONO TEM ASSINATURA ATIVA ] * >>>>>>>>>>>>>>>>

  useEffect(() => {
    if (participant.id) {
      handleFetchScore();
    }
  }, [participant]);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Participant {...participant} />
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dados do participante</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <UserRound color="#374151" strokeWidth={1.7} size={22} />
            <p className="font-inter font-medium text-[15px] text-gray-700">
              {participant.firstName} {participant.lastName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone color="#374151" strokeWidth={1.7} size={21} />
            <p className="font-inter font-medium text-[15px] text-gray-700">
              {mask.phoneNumber(participant.phoneNumber)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock color="#374151" strokeWidth={1.7} size={22} />
            <p className="font-inter font-medium text-[15px] text-gray-700">
              {participant.createdAt}
            </p>
          </div>
        </div>

        <div className="w-full bg-violet-200 rounded my-1 p-3">
          <p className="font-inter font-medium text-base text-gray-500 text-center">
            Saldo atual do participante
          </p>
          {isLoadingGetByParticipantId && (
            <div className="w-full flex justify-center mt-2">
              <Oval
                visible={true}
                height="36"
                width="36"
                color="#6b7280"
                ariaLabel="oval-loading"
                secondaryColor="#c4b5fd"
                strokeWidth={4}
              />
            </div>
          )}
          {!isLoadingGetByParticipantId && score !== null && (
            <p className="font-inter font-semibold text-3xl text-gray-500 text-center mt-2">
              {score}
            </p>
          )}
        </div>

        <div>
          <p className="font-inter font-medium text-gray-700">Recompensas disponíveis</p>
          <p className="font-inter font-normal text-sm text-gray-700">
            Selecione uma recompensa para trocar
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {rewards.map((reward) => (
              <Reward.Root
                key={reward.id}
                className="cursor-pointer"
                selected={selectedRewardId === reward.id}
                onClick={() => handleSelectReward(reward)}>
                <Reward.Name>{reward.name}</Reward.Name>
                <Reward.ScoreRate>
                  Pontuação necessária: {reward.scoreNeeded}
                </Reward.ScoreRate>
                {reward.description && (
                  <Reward.Description>{reward.description}</Reward.Description>
                )}
              </Reward.Root>
            ))}
          </div>
        </div>

        {!hasSufficientScore && (
          <div className="w-full bg-red-200 p-[6px] rounded flex items-center gap-2 border-[1px] border-red-500">
            <span>
              <CircleAlert strokeWidth={2} color="#ef4444" size={20} />
            </span>
            <p className="font-inter font-medium text-sm text-red-500">
              Saldo insuficiente para fazer a troca por uma das recompensas.
            </p>
          </div>
        )}

        <div className="w-full flex items-center justify-between">
          <Button
            type="button"
            className="bg-transparent px-3 py-2 font-inter font-normal text-sm border-[1px] border-gray-300"
            onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Button
            disabled={!hasSufficientScore || !selectedRewardId}
            className="bg-violet-900 px-3 py-2 font-inter font-normal text-sm text-white flex items-center gap-2">
            <HandCoins strokeWidth={2} color="#FFFFFF" size={20} />
            Trocar pontos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
