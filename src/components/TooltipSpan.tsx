import 'react-popper-tooltip/dist/styles.css';
import './TooltipSpan.css';
import 'twin.macro';

import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

const TooltipSpan = (props: { label: string; content: React.ReactNode }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ interactive: true, offset: [0, -2] });
  return (
    <>
      <span
        ref={setTriggerRef}
        data-tip="React-tooltip"
        tw="flex justify-center items-center w-[19px] h-[19px] text-xs text-[#152348] bg-[#C4C4C4] rounded-full cursor-pointer"
      >
        {props.label}
      </span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'tooltip-container' })}
        >
          {props.content}
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
        </div>
      )}
    </>
  );
};

export default TooltipSpan;
