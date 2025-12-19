import React from 'react';

interface Props extends React.PropsWithChildren {
  title: string;
}

const PageHeader: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="px-10 pt-8 pb-6.75 flex items-center justify-between bg-gray-5">
      <h1 className="text-headline-1 leading-12">{title}</h1>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
};

export default PageHeader;
