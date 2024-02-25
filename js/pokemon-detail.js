document.addEventListener("DOMContentLoaded", async () => {
  const divWrapper = document.getElementById("pokemonDetail");

  try {
    // Obtenha os detalhes dos pokémons
    const pokemonsDetails = await pokeApi.getPokemons();

    // Recupera o ID do Pokémon da URL
    const params = new URLSearchParams(window.location.search);
    const pokemonId = parseInt(params.get("id"));

    // Encontra o Pokémon correspondente na lista de detalhes de Pokémon
    const pokemon = pokemonsDetails.find((pokemon) => pokemon.id === pokemonId);

    if (!pokemon) {
      console.error("Pokémon não encontrado.");
      return;
    }

    // Obtém a descrição do Pokémon
    const description = await getPokemonDescription(pokemon.species.url);

    // Renderiza os detalhes do Pokémon
    divWrapper.innerHTML = detailHtml(pokemon, description);
  } catch (error) {
    console.error("Erro ao carregar os detalhes do Pokémon:", error);
  }
});

function convertPokemonTypeToLi(pokemontypes) {
  return pokemontypes
    .map(
      (typeSlot) =>
        `<li class="type ${typeSlot.type.name}">${typeSlot.type.name}</li>`
    )
    .join("");
}

function getAbilities(abilities) {
  return abilities
    .map((ability) => `<p class="">${ability.ability.name}</p>`)
    .join("");
}

function detailHtml(pokemon, description, moves) {
  const firstType = pokemon.types.length > 0 ? pokemon.types[0].type.name : "";
  const typesLi = convertPokemonTypeToLi(pokemon.types);

  const abilitiesList = getAbilities(pokemon.abilities);
  console.log(pokemon);
  return `
    <main class="detail-main">
        <header class="header ${firstType}">
          <div class="header-wrapper">
            <div class="header-wrap">
              <a href="./index.html" class="back-btn-wrap">
                <img width="64" height="64" 
                  src="https://img.icons8.com/glyph-neue/64/FFFFFF/up-arrow.png" 
                  alt="back to home"
                  class="back-btn rotated-icon"
                  id="back-btn"
                />
              </a>
              <div class="name-wrap">
                <h1 class="name">${pokemon.name}</h1>
              </div>
              <div class="pokemon-id-wrap">
                <h1 class="">#${String(pokemon.id).padStart(3, "0")}</h1>
              </div>
            </div>
          </div>
        </header>

        <div class="featured-img ${firstType}">
          <div class="detail-img-wrapper">
            <img src="${
              pokemon.sprites.other.dream_world.front_default
            }" alt="${pokemon.name}" />
          </div>
        </div>

        <div class="detail-card-detail-wrapper">
          <div class="power-wrapper">
            <ol class="types">
              ${typesLi}
            </ol>
          </div>

          <h2 class="about-text">About</h2>

          <div class="pokemon-detail-wrapper">
            <div class="pokemon-detail-wrap">
              <div class="pokemon-detail">
                <img
                  src="./assets/weight.svg"
                  alt="weight"
                />
                <p class="weight">${pokemon.weight / 10}kg</p>
              </div>
              <h4 class="caption-fonts">Weight</h4>
            </div>
            <div class="pokemon-detail-wrap">
              <div class="pokemon-detail">
                <img
                  src="./assets/height.svg"
                  alt="height"
                  class="straighten"
                />
                <p class="height">${pokemon.height / 10}m</p>
              </div>
              <h4 class="caption-fonts">Height</h4>
            </div>
            <div class="pokemon-detail-wrap">
              <div class="pokemon-detail move">
              ${abilitiesList}
              </div>
              <h4 class="caption-fonts">Moves</h4>
            </div>
          </div>

          <p class="pokemon-description">${description}</p>

          <h2 class="about-text">Base Stats</h2>

          <div class="stats-wrapper ${firstType}">
            <div class="stats-wrap" data-stat="hp">
              <p class="stats">HP</p>
              <p class="">${pokemon.stats[0].base_stat}</p>
              <progress value="${
                pokemon.stats[0].base_stat
              }" max="150" class="progress-bar"></progress>
            </div>
            <div class="stats-wrap" data-stat="ATK">
              <p class="stats">ATK</p>
              <p class="">${pokemon.stats[1].base_stat}</p>
              <progress value="${
                pokemon.stats[1].base_stat
              }" max="150" class="progress-bar"></progress>
            </div>
            <div class="stats-wrap" data-stat="DEF">
              <p class="stats">DEF</p>
              <p class="">${pokemon.stats[2].base_stat}</p>
              <progress value="${
                pokemon.stats[2].base_stat
              }" max="150" class="progress-bar"></progress>
            </div>
            <div class="stats-wrap" data-stat="SATK">
              <p class="stats">SATK</p>
              <p class="">${pokemon.stats[3].base_stat}</p>
              <progress value="${
                pokemon.stats[3].base_stat
              }" max="150" class="progress-bar"></progress>
            </div>
            <div class="stats-wrap" data-stat="SDEF">
              <p class="stats">SATK</p>
              <p class="">${pokemon.stats[4].base_stat}</p>
              <progress value="${
                pokemon.stats[4].base_stat
              }" max="150" class="progress-bar"></progress>
            </div>
            <div class="stats-wrap" data-stat="SPD">
              <p class="stats">SATK</p>
              <p class="">${pokemon.stats[5].base_stat}</p>
              <progress value="${
                pokemon.stats[5].base_stat
              }" max="150" class="progress-bar"></progress>
            </div>
        </div>
        </main>
        <div class="pokemon__background-complement ${firstType}"></div>
        </div>
        `;
      }

async function getPokemonDescription(speciesUrl) {
  try {
    const response = await fetch(speciesUrl);
    const pokemonSpecies = await response.json();
    return getEnglishFlavorText(pokemonSpecies);
  } catch (error) {
    console.error("Erro ao obter a descrição do Pokémon:", error);
    return "";
  }
}

function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}
