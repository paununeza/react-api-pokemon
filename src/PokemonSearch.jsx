import React, { useState, useEffect } from 'react';
import './PokemonSearch.css';

const PokemonSearch = () => {
  const [nombres, setNombres] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  // 1. Cargar lista de nombres al montar
  useEffect(() => {
    const fetchNombres = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await res.json();
        setNombres(data.results.map(p => p.name));
      } catch (err) {
        setError('No se pudieron cargar los nombres de Pokémon');
      }
    };

    fetchNombres();
  }, []);

  // 2. Manejar entrada de búsqueda y sugerencias
  const handleInputChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    if (valor.length === 0) {
      setSugerencias([]);
      return;
    }

    const filtradas = nombres
      .filter(nombre => nombre.startsWith(valor))
      .slice(0, 5); // solo 5 sugerencias

    setSugerencias(filtradas);
  };

  // 3. Buscar Pokémon
  const buscarPokemon = async (nombre) => {
    try {
      setError(null);
      setPokemon(null);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
      if (!res.ok) throw new Error('Pokémon no encontrado');
      const data = await res.json();
      setPokemon({
        id: data.id,
        nombre: data.name,
        imagen: data.sprites.front_default,
        tipos: data.types.map(t => t.type.name),
      });
    } catch (err) {
      setError('Pokémon no encontrado');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      buscarPokemon(busqueda.trim());
      setSugerencias([]);
    }
  };

  return (
    <div className="pokemon-container">
      <h2>Buscador de Pokémon</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe el nombre de un Pokémon"
          value={busqueda}
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </form>

      {sugerencias.length > 0 && (
        <ul className="sugerencias">
          {sugerencias.map((nombre, i) => (
            <li key={i} onClick={() => {
              setBusqueda(nombre);
              buscarPokemon(nombre);
              setSugerencias([]);
            }}>
              {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
            </li>
          ))}
        </ul>
      )}

      {error && <div className="error">{error}</div>}

      {pokemon && (
        <div className="pokemon-card">
          <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
          <img src={pokemon.imagen} alt={pokemon.nombre} />
          <p><strong>Tipos:</strong> {pokemon.tipos.map(tipo => tipo.charAt(0).toUpperCase() + tipo.slice(1)).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default PokemonSearch;