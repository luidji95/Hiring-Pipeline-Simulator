type SpinnerProps = {
  size?: number;
  ariaLabel?: string;
  className?: string;
};

export const Spinner = ({
  size = 16,
  ariaLabel = "Loading",
  className = "",
}: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={`spinner ${className}`.trim()}
      style={{ width: size, height: size }}
    />
  );
};