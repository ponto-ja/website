import Link from 'next/link';
import { ComponentType, FC } from 'react';
import clsx from 'clsx';

type NavigationProps = {
  title: string;
  href: string;
  icon: ComponentType<Record<string, unknown>>;
  active: boolean;
};

export const Navigation: FC<NavigationProps> = ({ title, href, icon: Icon, active }) => {
  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-2 font-inter font-medium text-base w-full pr-10 rounded-md p-2',
        {
          'bg-violet-900 text-white': active,
          'bg-transparent text-gray-700': !active,
        },
      )}>
      <Icon strokeWidth={1.5} color={active ? '#FFFFFF' : '#374151'} />
      {title}
    </Link>
  );
};
