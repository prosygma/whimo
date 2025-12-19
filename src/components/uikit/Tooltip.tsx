import React, { type PropsWithChildren } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

const TooltipProvider = RadixTooltip.Provider;
const TooltipRoot = RadixTooltip.Root;
const TooltipTrigger = RadixTooltip.Trigger;
const TooltipPortal = RadixTooltip.Portal;
const TooltipContent = RadixTooltip.Content;
const TooltipArrow = RadixTooltip.TooltipArrow;

interface Props extends PropsWithChildren {
  trigger: React.ReactNode;
  side?: RadixTooltip.TooltipContentProps['side'];
}

const Tooltip: React.FC<Props> = ({ trigger, side = 'top', children }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <TooltipRoot>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            align="center"
            side={side}
            sideOffset={8}
            className="max-w-62 px-4 py-3 bg-midnight-blue text-body-xs text-white rounded-lg"
          >
            {children}
            <TooltipArrow width="18" height="8" className=" fill-midnight-blue" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export default Tooltip;
