import { twMerge } from 'tailwind-merge';
import { forwardRef, ComponentProps } from 'react';

type InputFieldProps = ComponentProps<'input'> & {
  label: string;
  rootClassName?: ComponentProps<'div'>['className'];
  error?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ rootClassName, label, className, required, error, ...props }, ref) => {
    return (
      <div className={twMerge('flex flex-col', rootClassName)}>
        <label htmlFor={props.name} className="font-inter font-medium text-gray-700">
          {label}
          {required && '*'}
        </label>
        <input
          ref={ref}
          id={props.name}
          className={twMerge(
            'w-full rounded border-[1px] border-gray-200 py-2 px-3 mt-1 outline-violet-900 font-inter font-normal text-gray-700 placeholder:font-light',
            className,
          )}
          {...props}
        />
        <p className="font-inter font-normal text-sm text-red-500">{error}</p>
      </div>
    );
  },
);
