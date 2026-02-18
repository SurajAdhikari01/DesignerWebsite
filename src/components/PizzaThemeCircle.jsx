// inside your PizzaThemeCircle component
const PizzaThemeCircle = ({ theme, isActive, isHovered }) => {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 100 100"
      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isHovered ? "rotate-90 scale-110" : "rotate-0 scale-100"
      }`}
    >
      {/* Slices of the theme "DNA" */}
      <path
        d="M 50 50 L 50 0 A 50 50 0 0 1 93.301 75 Z"
        fill={theme.preview[0]}
      />
      <path
        d="M 50 50 L 93.301 75 A 50 50 0 0 1 6.699 75 Z"
        fill={theme.preview[1]}
      />
      <path
        d="M 50 50 L 6.699 75 A 50 50 0 0 1 50 0 Z"
        fill={theme.preview[2]}
      />

      {isActive && (
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
          stroke="white"
          strokeWidth="4"
          className="animate-ping opacity-20"
        />
      )}
    </svg>
  );
};
