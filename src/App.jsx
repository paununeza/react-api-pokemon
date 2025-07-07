import React, { useState } from 'react';
import PokemonSearch from './PokemonSearch';


function App() {
  // Estado para almacenar el historial
  const [historial, setHistorial] = useState([]);
  // Estado para el Pokémon que se selecciona desde el historial
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Historial</h2>
        {historial.length > 0 && (
          <div className="historial-sidebar">
             {/* Recorre el historial y renderiza cada Pokémon */}
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