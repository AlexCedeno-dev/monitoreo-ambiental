import { useMemo } from 'react';

const ICONS = {
  temperatura: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  humedad: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  aire: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  ),
};

const LABELS = { good: 'Normal', warning: 'Precaución', danger: 'Alerta' };

export default function SensorCard({ title, value, unit, colorKey, min, max, thresholds, decimals = 1 }) {
  const numValue = value !== null && value !== undefined ? Number(value) : null;

  const status = useMemo(() => {
    if (numValue === null) return 'good';
    if (numValue >= thresholds.danger) return 'danger';
    if (numValue >= thresholds.warning) return 'warning';
    return 'good';
  }, [numValue, thresholds]);

  const pct = useMemo(() => {
    if (numValue === null) return 0;
    return Math.min(100, Math.max(0, ((numValue - min) / (max - min)) * 100));
  }, [numValue, min, max]);

  const RADIUS = 42;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  const displayValue = numValue !== null
    ? (decimals === 0 ? Math.round(numValue).toString() : numValue.toFixed(decimals))
    : '--';

  return (
    <div className={`sensor-card sensor-card--${colorKey} sensor-card--${status}`}>
      <div className="sensor-card__header">
        <div className={`sensor-icon sensor-icon--${colorKey}`}>
          {ICONS[colorKey]}
        </div>
        <div>
          <p className="sensor-title">{title}</p>
          <span className={`sensor-badge sensor-badge--${status}`}>{LABELS[status]}</span>
        </div>
      </div>

      <div className="sensor-card__body">
        <div className="sensor-ring-wrapper">
          <svg className="sensor-ring" viewBox="0 0 100 100">
            <circle className="ring-track" cx="50" cy="50" r={RADIUS} />
            <circle
              className={`ring-fill ring-fill--${status}`}
              cx="50" cy="50" r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="sensor-value">
            <span className="sensor-number">{displayValue}</span>
            <span className="sensor-unit">{unit}</span>
          </div>
        </div>
      </div>

      <div className="sensor-card__footer">
        <span className="sensor-range">Min {min}{unit}</span>
        <div className="sensor-bar">
          <div
            className={`sensor-bar__fill sensor-bar__fill--${status}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="sensor-range">Max {max}{unit}</span>
      </div>
    </div>
  );
}
