document.addEventListener("DOMContentLoaded", () => {
  const listWrapper = document.getElementById("pokemonList");

  function convertPokemonTypeToLi(pokemontypes) {
    return pokemontypes
      .map((typeSlot) => `<li class="type ${typeSlot.type.name}">${typeSlot.type.name}</li>`)
      .join("");
  }

  function convertPokemonToLi(pokemon) {
    const firstType =
      pokemon.types.length > 0 ? pokemon.types[0].type.name : "";

    const typesLi = convertPokemonTypeToLi(pokemon.types);

    return `
            <li class="pokemon pokemon__glass ${firstType}">
                <span class="number">#${String(pokemon.id).padStart(3, "0")}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${typesLi}
                    </ol>

                    <img src="${pokemon.sprites.other.dream_world.front_default}"
                        alt="${pokemon.name}">
                </div>
            </li>
        `;
  }

  if (listWrapper) {
    pokeApi.getPokemons().then((pokemons = []) => {
      const newHtml = pokemons.map(convertPokemonToLi).join("");
      listWrapper.innerHTML += newHtml;

      listWrapper.addEventListener("click", (event) => {
        const listItem = event.target.closest("li.pokemon");
        if (listItem) {
          const pokemonId = listItem
            .querySelector(".number")
            .textContent.slice(1);
          window.location.href = `./detail.html?id=${pokemonId}`;
        }
      });
    });
  }
});
