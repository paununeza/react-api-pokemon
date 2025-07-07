import React, { useState } from 'react';
import PokemonSearch from './PokemonSearch';

function App() {
  const [historial, setHistorial] = useState([]);
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Historial</h2>
        {historial.length > 0 && (
          <div className="historial-sidebar">
            {historial.map((p) => (
              <div
                key={p.id}
                className="historial-item"
                onClick={() => setPokemonSeleccionado(p)}
                style={{ cursor: 'pointer' }}
              >
                <img src={p.imagen} alt={`Sprite de ${p.nombre}`} />
                <span>{p.nombre.charAt(0).toUpperCase() + p.nombre.slice(1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="main-content">
        <PokemonSearch
          setHistorial={setHistorial}
          historial={historial}
          pokemonSeleccionado={pokemonSeleccionado}
        />
      </div>
    </div>
  );
}

export default App;
