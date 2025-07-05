import React, { useState } from 'react';
import PokemonSearch from './PokemonSearch';

function App() {
  const [historial, setHistorial] = useState([]);

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Pokédex</h2>
        {historial.length > 0 && (
          <div className="historial-sidebar">
            {historial.map((p) => (
              <div key={p.id} className="historial-item">
                <img src={p.imagen} alt={p.nombre} />
                <span>{p.nombre.charAt(0).toUpperCase() + p.nombre.slice(1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="main-content">
        <PokemonSearch setHistorial={setHistorial} historial={historial} />
      </div>
    </div>
  );
}

export default App;
