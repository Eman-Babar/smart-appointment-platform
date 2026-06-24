export default function Background() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    duration: `${Math.random() * 20 + 15}s`,
    delay: `${Math.random() * 20}s`,
  }));

  return (
    <>
      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Particles */}
      <div className="particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              bottom: '-10px',
            }}
          />
        ))}
      </div>
    </>
  );
}