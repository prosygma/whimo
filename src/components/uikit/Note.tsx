import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

type Props = VariantProps<typeof noteVariants> & {
  message: string;
  cta?: React.ReactNode;
};

const noteVariants = cva('px-4 py-3 flex gap-2 items-start rounded-lg', {
  variants: {
    type: {
      info: 'bg-primary-subtle border border-border-info [&>svg]:text-primary',
      warning: 'bg-light-orange border border-border-warning [&>svg]:text-warning',
    },
  },
});

const Note: React.FC<Props> = ({ type, message, cta = null }) => {
  return (
    <div className={noteVariants({ type })}>
      {type === 'info' ? (
        <InformationCircleIcon className="size-6 shrink-0" />
      ) : (
        <ExclamationTriangleIcon className="size-6 shrink-0" />
      )}
      <div className="flex flex-col gap-2 items-start">
        <p className="text-body-s">{message}</p>
        {cta}
      </div>
    </div>
  );
};

export default Note;
