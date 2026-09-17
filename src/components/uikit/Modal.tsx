import React, { type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}
const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-body-medium-l">{title}</h3>
      <XMarkIcon className="size-6 text-gray-50 cursor-pointer" onClick={onClose} />
    </div>
  );
};

const ModalBody: React.FC<PropsWithChildren> = ({ children }) => {
  return children;
};

interface ModalFooterProps extends PropsWithChildren {
  className?: string;
}
const ModalFooter: React.FC<ModalFooterProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

interface CompoundComponentProps {
  ModalHeader: typeof ModalHeader;
  ModalBody: typeof ModalBody;
  ModalFooter: typeof ModalFooter;
}
interface Props extends React.PropsWithChildren {
  isOpen: boolean;
}

const Modal: React.FC<Props> & CompoundComponentProps = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed w-full h-full flex justify-center items-center bg-surface-dark-backdrop inset-0">
      <div className="w-110 bg-white rounded-lg [&>*]:p-6 [&>*]:border-b-2 [&>*]:border-b-gray-5 [&>*]:last:border-none transition-[height] duration-500">
        {children}
      </div>
    </div>,
    document.body,
  );
};

Modal.ModalHeader = ModalHeader;
Modal.ModalBody = ModalBody;
Modal.ModalFooter = ModalFooter;
export default Modal;
