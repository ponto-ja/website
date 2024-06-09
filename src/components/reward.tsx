import clsx from 'clsx';
import { Trash, SquarePen } from 'lucide-react';
import { ComponentProps, FC } from 'react';
import { twMerge } from 'tailwind-merge';

type RewardRootProps = ComponentProps<'div'> & {
  selected?: boolean;
};

const RewardRoot: FC<RewardRootProps> = ({ className, children, selected, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx('w-full border-[1px] border-gray-200 rounded px-3 py-2', {
          'border-violet-700': selected,
          'border-gray-200': !selected,
        }),
        className,
      )}
      {...props}>
      {children}
    </div>
  );
};

const RewardName: FC<ComponentProps<'p'>> = ({ className, children, ...props }) => {
  return (
    <p
      className={twMerge('font-inter font-semibold text-gray-700', className)}
      {...props}>
      {children}
    </p>
  );
};

const RewardScoreRate: FC<ComponentProps<'p'>> = ({ className, children, ...props }) => {
  return (
    <p
      className={twMerge('font-inter font-normal text-sm text-gray-500 mt-2', className)}
      {...props}>
      {children}
    </p>
  );
};

const RewardDescription: FC<ComponentProps<'p'>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={twMerge('font-inter font-normal text-sm text-gray-500 mt-1', className)}
      {...props}>
      {children}
    </p>
  );
};

const RewardActionsWrap: FC<ComponentProps<'div'>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge('w-full flex items-center justify-end gap-6 mt-2', className)}
      {...props}>
      {children}
    </div>
  );
};

const RewardDeleteAction: FC<ComponentProps<'button'>> = ({ className, ...props }) => {
  return (
    <button
      className={twMerge('disabled:opacity-50 disabled:cursor-not-allowed', className)}
      {...props}>
      <Trash strokeWidth={2} color="#ef4444" size={22.5} />
    </button>
  );
};

const RewardUpdateAction: FC<ComponentProps<'button'>> = ({ className, ...props }) => {
  return (
    <button
      className={twMerge('disabled:opacity-50 disabled:cursor-not-allowed', className)}
      {...props}>
      <SquarePen strokeWidth={2} color="#4b5563" size={22} />
    </button>
  );
};

export const Reward = {
  Root: RewardRoot,
  Name: RewardName,
  ScoreRate: RewardScoreRate,
  Description: RewardDescription,
  Actions: {
    Wrap: RewardActionsWrap,
    Delete: RewardDeleteAction,
    Update: RewardUpdateAction,
  },
};
