import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from './firebase';
import SensorCard from './components/SensorCard';
import HistoryChart from './components/HistoryChart';
import ActuatorPanel from './components/ActuatorPanel';
import './App.css';

const MAX_HISTORY = 30;

const DEFAULT_SENSORES = {
  temperatura: null,
  humedad: null,
  calidad_aire: null,
  hora: '--:--',
  fecha: '-- / -- / ----',
};

export default function App() {
  const [sensores, setSensores] = useState(DEFAULT_SENSORES);
  const [actuadores, setActuadores] = useState({ led: false, buzzer: false });
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sensoresRef = ref(db, 'sensores');
    const actuadoresRef = ref(db, 'actuadores');

    const unsubSensores = onValue(
      sensoresRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        setConnected(true);
        setSensores(data);
        setHistory((prev) => {
          const entry = {
            time: data.hora ?? new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            temperatura: Number(data.temperatura) || 0,
            humedad: Number(data.humedad) || 0,
            calidad_aire: Number(data.calidad_aire) || 0,
          };
          return [...prev, entry].slice(-MAX_HISTORY);
        });
      },
      () => setConnected(false),
    );

    const unsubActuadores = onValue(actuadoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setActuadores(data);
    });

    return () => {
      unsubSensores();
      unsubActuadores();
    };
  }, []);

  const toggleActuador = (key) => {
    set(ref(db, `actuadores/${key}`), !actuadores[key]);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <div className="header__logo">
            <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
              <circle cx="16" cy="16" r="14" stroke="#00d2ff" strokeWidth="2" opacity="0.4" />
              <circle cx="16" cy="16" r="9" stroke="#00d2ff" strokeWidth="2" />
              <path d="M16 9 L16 15" stroke="#00d2ff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M16 15 L20 19" stroke="#ff7043" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="21" r="2.5" fill="#00d2ff" />
            </svg>
          </div>
          <div>
            <h1 className="header__title">Monitoreo Ambiental</h1>
            <p className="header__sub">Sistema IoT &middot; ESP8266</p>
          </div>
        </div>

        <div className="header__meta">
          <div className={`status-badge ${connected ? 'status-badge--online' : 'status-badge--offline'}`}>
            <span className="status-badge__dot" />
            {connected ? 'En l&iacute;nea' : 'Sin conexi&oacute;n'}
          </div>
          <div className="header__datetime">
            <span className="header__date">{sensores.fecha}</span>
            <span className="header__time">{sensores.hora}</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="sensors-section">
          <div className="sensors-grid">
            <SensorCard
              title="Temperatura"
              value={sensores.temperatura}
              unit="°C"
              colorKey="temperatura"
              min={0}
              max={50}
              thresholds={{ warning: 28, danger: 35 }}
              decimals={1}
            />
            <SensorCard
              title="Humedad Relativa"
              value={sensores.humedad}
              unit="%"
              colorKey="humedad"
              min={0}
              max={100}
              thresholds={{ warning: 75, danger: 90 }}
              decimals={1}
            />
            <SensorCard
              title="Calidad del Aire"
              value={sensores.calidad_aire}
              unit=" AQI"
              colorKey="aire"
              min={0}
              max={500}
              thresholds={{ warning: 100, danger: 200 }}
              decimals={0}
            />
          </div>
        </section>

        <section className="chart-section">
          <div className="section-header">
            <h2 className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Historial en Tiempo Real
            </h2>
            <span className="section-badge">&uacute;ltimas {history.length} lecturas</span>
          </div>
          <HistoryChart data={history} />
        </section>

        <section className="actuators-section">
          <div className="section-header">
            <h2 className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
              Control de Actuadores
            </h2>
            <span className="section-badge">Haz clic para alternar</span>
          </div>
          <ActuatorPanel actuadores={actuadores} onToggle={toggleActuador} />
        </section>
      </main>

      <footer className="footer">
        <p>Monitoreo Ambiental IoT &mdash; ESP8266 + Firebase Realtime Database</p>
      </footer>
    </div>
  );
}
