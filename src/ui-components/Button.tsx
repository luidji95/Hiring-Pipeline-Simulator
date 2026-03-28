import React from "react";
import { Spinner } from "./Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading = false, disabled, children, className = "", ...rest }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        {...rest}
        disabled={isDisabled}
        className={`ui-btn ${className}`.trim()}
        aria-busy={isLoading}
      >
        {isLoading && <Spinner size={14} />}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";