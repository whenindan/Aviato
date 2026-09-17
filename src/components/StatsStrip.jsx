const stats = [
  { value: "14 CFR", label: "Parts 61 · 91 · 71 covered" },
  { value: "1", label: "Debrief after every flight" },
];

export default function StatsStrip() {
  return (
    <section className="stats surface-light">
      <div className="container stats__grid">
        {stats.map((stat) => (
          <div className="stats__item" key={stat.label}>
            <p className="stats__value">{stat.value}</p>
            <p className="label stats__label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
