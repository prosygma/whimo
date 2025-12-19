import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import type { PopoverContentProps } from '@radix-ui/react-popover';

const PopoverRoot = RadixPopover.Root;
const PopoverTrigger = RadixPopover.Trigger;
const PopoverPortal = RadixPopover.Portal;
const PopoverContent = RadixPopover.Content;

interface Props extends React.PropsWithChildren, PopoverContentProps {
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Popover: React.FC<Props> = ({ trigger, open = false, onOpenChange, children, ...props }) => {
  return (
    <PopoverRoot open={open} onOpenChange={onOpenChange} modal>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverPortal>
        <PopoverContent {...props}>
          {children}
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
};

export default Popover;
