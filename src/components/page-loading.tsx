'use client';

import { ComponentProps, FC, PropsWithChildren } from 'react';
import { Oval } from 'react-loader-spinner';
import { twMerge } from 'tailwind-merge';

type PageLoadingProps = {
  className?: ComponentProps<'div'>['className'];
  isLoading: boolean;
};

export const PageLoading: FC<PropsWithChildren<PageLoadingProps>> = ({
  children,
  className,
  isLoading,
}) => {
  if (!isLoading) return children;

  return (
    <div className={twMerge('mt-[100px] flex justify-center', className)}>
      <Oval
        visible={true}
        height="46"
        width="46"
        color="#4c1d95"
        ariaLabel="oval-loading"
        secondaryColor="#c4b5fd"
        strokeWidth={4}
      />
    </div>
  );
};
