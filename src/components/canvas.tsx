import React, { ClassAttributes, CanvasHTMLAttributes, forwardRef, ForwardedRef } from 'react';

function Canvas(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLCanvasElement> &
    CanvasHTMLAttributes<HTMLCanvasElement>,
  ref: ForwardedRef<HTMLCanvasElement> | undefined
): JSX.Element {
  return <canvas width="300" height="150" style={{ position: 'absolute' }} {...props} ref={ref} />;
}

export const TreeCanvas = forwardRef(Canvas);
