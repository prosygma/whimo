import React, { createContext, type PropsWithChildren, useContext } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface DrawerContextInterface {
  scrollable?: boolean;
}

const DrawerContext = createContext<DrawerContextInterface>({});

interface SideDrawerHeaderProps extends PropsWithChildren {
  title: string;
  goBack?: () => void;
  className?: string;
}
const SideDrawerHeader: React.FC<SideDrawerHeaderProps> = ({ title, children, goBack, className = '' }) => {
  const { scrollable } = useContext(DrawerContext);

  return (
    <div className={`${className} flex items-center justify-between gap-3 ${scrollable && 'sticky top-0 bg-white z-1'}`}>
      {goBack && <ArrowLeftIcon className="size-6 text-gray-40 hover:text-gray-60 cursor-pointer" onClick={goBack} />}
      <h3 className="text-body-medium-l flex-1 min-w-0 text-nowrap overflow-hidden text-ellipsis">{title}</h3>
      <div className="flex gap-4 text-gray-50 [&>*]:shrink-0">{children}</div>
    </div>
  );
};

const SideDrawerBody: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex-1 overflow-y-auto">{children}</div>;
};

interface SideDrawerFooterProps extends PropsWithChildren {
  className?: string;
}
const SideDrawerFooter: React.FC<SideDrawerFooterProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

interface CompoundComponentProps {
  SideDrawerHeader: typeof SideDrawerHeader;
  SideDrawerBody: typeof SideDrawerBody;
  SideDrawerFooter: typeof SideDrawerFooter;
}

interface Props extends React.PropsWithChildren {
  isOpen: boolean;
  onClose?: () => void;
  withBackdrop?: boolean;
  scrollable?: boolean;
  align?: 'left' | 'right';
}

const SideDrawer: React.FC<Props> & CompoundComponentProps = ({
  isOpen,
  onClose,
  withBackdrop = true,
  children,
  scrollable = false,
  align = 'right',
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = () => {
    onClose?.();
  };

  return createPortal(
    <DrawerContext.Provider value={{ scrollable }}>
      <div className="fixed inset-0 flex">
        {withBackdrop && (
          <div
            className="fixed inset-0 bg-surface-dark-backdrop transition-opacity duration-300"
            onClick={handleBackdropClick}
          />
        )}

        <div
          className={`${align === 'right' ? 'ml-auto' : 'ml-70'} relative w-110 bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col`}
        >
          <div
            className={`relative flex flex-col h-full [&>*]:px-6 [&>*]:py-4 [&>*]:border-b-2 [&>*]:bg-white [&>*]:border-b-gray-5 [&>*]:last:border-none bg-gray-5 ${scrollable && 'overflow-y-scroll'}`}
          >
            {children}
          </div>
        </div>
      </div>
    </DrawerContext.Provider>,
    document.body,
  );
};

SideDrawer.SideDrawerHeader = SideDrawerHeader;
SideDrawer.SideDrawerBody = SideDrawerBody;
SideDrawer.SideDrawerFooter = SideDrawerFooter;

export default SideDrawer;
