const BackgroundGrid = ({ accentColor, isDarkTheme, opacity = 0.03 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Consistent Grid pattern throughout */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${
              isDarkTheme
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`
            } 1px, transparent 1px),
            linear-gradient(90deg, ${
              isDarkTheme
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`
            } 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Subtle accent line overlay - optional, remove if not needed */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(${accentColor} 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor} 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  );
};

export default BackgroundGrid;
