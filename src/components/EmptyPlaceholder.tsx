import React from 'react';

interface Props extends React.PropsWithChildren {
  Icon: React.ElementType,
  title: string;
  className?: string;
}

const EmptyPlaceholder: React.FC<Props> = ({ Icon, title, children, className = '' }) => {
  return (
    <div className={`${className} flex flex-col items-center text-center pt-30 [&>p]:text-gray-60 [&>*]:max-w-94`}>
      <div className="flex justify-center items-center size-18 bg-gray-5 rounded-full">
        <Icon className="size-8 text-gray-50" />
      </div>
      <h3 className="mt-6 text-headline-2 capitalize">{title}</h3>
      {children}
    </div>
  );
};

export default EmptyPlaceholder;
