import React, { useState, useEffect } from 'react';
import './PokemonSearch.css';
import selectSound from './assets/sounds/select.mp3';

const tipoColores = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

// Componente principal del buscador Pokémon
// Para buscar Pokémon por nombre, mostrar sugerencias y ver detalles del Pokémon seleccionado
const PokemonSearch = ({ setHistorial, historial, pokemonSeleccionado }) => {
  // Estados locales
  const [todos, setTodos] = useState([]);
  const [busqueda, setBusqueda] = useState(''); // Texto ingresado en el input
  const [sugerencias, setSugerencias] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Cargar lista de los 1000 primeros Pokémon desde la API
  useEffect(() => {
    const fetchNombres = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await res.json();
        setTodos(data.results);
      } catch (err) {
        setError('No se pudieron cargar los nombres de Pokémon');
      }
    };

    fetchNombres();
  }, []);

// Efecto para buscar Pokémon cuando se selecciona uno del historial
  useEffect(() => {
  if (pokemonSeleccionado) {
    buscarPokemon(pokemonSeleccionado.nombre);
    setBusqueda('');
    setSugerencias([]);
  }
}, [pokemonSeleccionado]);


  // Manejar input de búsqueda
  const handleInputChange = async (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    if (valor.length === 0) {
      setSugerencias([]);
      return;
    }

    const coincidencias = todos
      .filter(p => p.name.startsWith(valor))
      .slice(0, 5); // Limitar a 5 sugerencias

    // Fetch sprites solo para sugerencias visibles
    const sugerenciasConSprites = await Promise.all(
      coincidencias.map(async p => {
        try {
          const res = await fetch(p.url);
          const data = await res.json();
          return {
            nombre: p.name,
            sprite: data.sprites.front_default
          };
        } catch {
          return { nombre: p.name, sprite: null };
        }
      })
    );

    setSugerencias(sugerenciasConSprites);
  };
  // Reproducir sonido al buscar Pokémon
  const reproducirSonido = () => {
  const audio = new Audio(selectSound);
  audio.currentTime = 0;
  audio.play();
  };

  // Función para buscar un Pokémon por nombre
  const buscarPokemon = async (nombre) => {
    if (!nombre) return;

    reproducirSonido();

    try {
      setCargando(true);
      setError(null);
      setPokemon(null);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
      if (!res.ok) throw new Error('Pokémon no encontrado');
      
      const data = await res.json();
      // Crear objeto Pokémon con la información necesaria
      const nuevoPokemon = {
      id: data.id,
      nombre: data.name,
      imagen: data.sprites.front_default,
      tipos: data.types.map(t => t.type.name),
    };

      setPokemon(nuevoPokemon);

      // Actualizar historial de búsqueda sin duplicados y max. 4 pokémon
      setHistorial((prev) => {
        const yaExiste = prev.find(p => p.id === nuevoPokemon.id);
        if (yaExiste) {
          // Si ya estaba, mover al inicio
          const filtrado = prev.filter(p => p.id !== nuevoPokemon.id);
          return [nuevoPokemon, ...filtrado];
        }

        const nuevoHistorial = [nuevoPokemon, ...prev];
        return nuevoHistorial.slice(0, 4); // Máximo 4 pokemon en el historial
      });


  } catch (err) {
    setError(err.message);
  } finally {
    setCargando(false);
  }
};
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      buscarPokemon(busqueda.trim());
      setBusqueda('');
      setSugerencias([]);
    }
  };

  // Renderizar el componente
  return (
    <div className="pokemon-container">
      <h2>Buscador de Pokémon</h2>
    
      {/* Formulario de búsqueda */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe el nombre de un Pokémon"
          value={busqueda}
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </form>

    {/* Lista de sugerencias */}
      {sugerencias.length > 0 && (
        <ul className="sugerencias">
          {sugerencias.map((s, i) => (        // Mostrar sugerencias con sprites
            <li key={i} onClick={() => {      
              setBusqueda(s.nombre);
              buscarPokemon(s.nombre);
              setSugerencias([]);
            }}>
              {s.sprite && <img src={s.sprite} alt={s.nombre} className="miniatura" />}
              {s.nombre.charAt(0).toUpperCase() + s.nombre.slice(1)}
            </li>
          ))}
        </ul>
      )}

      {error && <div className="error">{error}</div>}

      {/* Tarjeta con información del Pokémon */}
      {pokemon && (
        <div className="pokemon-card">
          <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
          <img src={pokemon.imagen} alt={pokemon.nombre} />
          <div className="tipos">
            {pokemon.tipos.map((tipo, i) => (
              <span
                key={i}
                className="tipo"
                style={{ backgroundColor: tipoColores[tipo] || '#777' }} // Mostrar tipos con colores
              >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)} 
            </span>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default PokemonSearch;