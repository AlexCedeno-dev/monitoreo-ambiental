const LedIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
    <path
      d="M12 2a7 7 0 0 1 7 7c0 2.62-1.44 4.91-3.57 6.13L15 17H9l-.43-1.87A7 7 0 0 1 5 9a7 7 0 0 1 7-7z"
      fill={active ? '#ffd54f' : '#30363d'}
      stroke={active ? '#ffb300' : '#484f58'}
      strokeWidth="1.5"
    />
    <path d="M9 17h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2z" fill={active ? '#ffb300' : '#30363d'} />
    {active && (
      <>
        <line x1="12" y1="1" x2="12" y2="0" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
        <line x1="4.22" y1="4.22" x2="3.5" y2="3.5" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
        <line x1="19.78" y1="4.22" x2="20.5" y2="3.5" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
        <line x1="1" y1="11" x2="2.5" y2="11" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
        <line x1="21.5" y1="11" x2="23" y2="11" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const BuzzerIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
    <polygon
      points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
      fill={active ? '#ef5350' : '#30363d'}
      stroke={active ? '#c62828' : '#484f58'}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {active ? (
      <>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#ef5350" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <line x1="23" y1="9" x2="17" y2="15" stroke="#484f58" strokeWidth="2" strokeLinecap="round" />
    )}
  </svg>
);

export default function ActuatorPanel({ actuadores, onToggle }) {
  const items = [
    {
      key: 'led',
      label: 'LED',
      description: actuadores.led ? 'Encendido' : 'Apagado',
      Icon: LedIcon,
      activeClass: 'actuator--led-on',
    },
    {
      key: 'buzzer',
      label: 'Buzzer',
      description: actuadores.buzzer ? 'Activo' : 'Silenciado',
      Icon: BuzzerIcon,
      activeClass: 'actuator--buzzer-on',
    },
  ];

  return (
    <div className="actuator-grid">
      {items.map(({ key, label, description, Icon, activeClass }) => {
        const active = !!actuadores[key];
        return (
          <button
            key={key}
            className={`actuator-card ${active ? activeClass : ''}`}
            onClick={() => onToggle(key)}
            aria-pressed={active}
          >
            <div className={`actuator-glow ${active ? 'actuator-glow--active' : ''}`}>
              <Icon active={active} />
            </div>
            <div className="actuator-info">
              <span className="actuator-label">{label}</span>
              <span className={`actuator-state ${active ? 'actuator-state--on' : 'actuator-state--off'}`}>
                {description}
              </span>
            </div>
            <div className={`actuator-toggle ${active ? 'actuator-toggle--on' : ''}`}>
              <div className="actuator-toggle__thumb" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
