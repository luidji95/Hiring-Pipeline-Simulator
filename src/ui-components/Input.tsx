import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  registration?: UseFormRegisterReturn;
  wrapperClassName?: string;
  inputClassName?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      registration,
      wrapperClassName = "",
      inputClassName = "",
      ...rest
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedById = helperText || error ? `${inputId}-desc` : undefined;

    return (
      <div className={`ui-field ${wrapperClassName}`.trim()}>
        {label && (
          <label className="ui-field__label" htmlFor={inputId}>
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`ui-field__input ${error ? "ui-field__input--error" : ""} ${inputClassName}`.trim()}
          aria-invalid={!!error}
          aria-describedby={describedById}
          {...registration}
          {...rest}
        />

        {error && (
          <div id={describedById} className="ui-field__error">
            {error}
          </div>
        )}

        {helperText && !error && (
          <div id={describedById} className="ui-field__helper">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";