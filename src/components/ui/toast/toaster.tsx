'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { useToast } from './use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        titleClassName,
        descriptionClassName,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle className={titleClassName}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={descriptionClassName}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
