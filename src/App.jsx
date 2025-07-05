import React from 'react';
import PokemonSearch from './PokemonSearch';

function App() {
  return (
    <div className="container">
      <div className="sidebar">
        <h2>Pokédex</h2>
      </div>
      <div className="main-content">
        <PokemonSearch />
      </div>
    </div>
  );
}

export default App;