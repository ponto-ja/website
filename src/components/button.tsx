import { FC, ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export const Button: FC<ComponentProps<'button'>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        'rounded-md py-1 px-2 hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}>
      {children}
    </button>
  );
};
