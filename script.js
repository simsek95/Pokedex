let pokemonCountTotal = getPokemonCount();
let chunkSize = 10;
let currentShownPokemonIndex = 1;

async function getPokemonCount() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
  let response = await fetch(url);
  let responseToJson = await response.json();
  console.log(responseToJson.count);
  return responseToJson.count;
}

async function loadNextChunk() {
  for (let i = 1; i < chunkSize + 1; i++) {
    await loadPokemon(i);
  }
}

async function loadPokemon(index) {
  let response = await fetch(getPokemonUrl(index));
  let responseToJson = await response.json();
  let pokeName = capitalizeFirstLetter(responseToJson.name);
  let sprite = responseToJson.sprites.front_default;
  let types = responseToJson.types;
  let type0 = types[0].type.name;
  let type1;
  if (types.length > 1) {
    type1 = responseToJson.types[1].type.name;
  }
  renderPokemon(index, pokeName, sprite, type0, type1);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokemon(index, pokeName, sprite, type0, type1) {
  let container = document.getElementById("pokeCardPreviewContainer");
  container.innerHTML += cardPreviewHTML(index, pokeName, sprite, type0, type1);
}

function getPokemonUrl(index) {
  return `https://pokeapi.co/api/v2/pokemon/${index}/`
}

function cardPreviewHTML(index, pokeName, spriteSrc, type0, type1) {

  if (type1 != undefined)
    return /*html*/`
    <div class="pokemon-card-preview ${type0}" onclick="renderBigCard(${index})" >
    <h3>${pokeName}</h3>
    <div class="poke-info-preview">
      <div class="types-container">
        <div class="type-tag ${type0}-opacity-1 ">${type0}</div>
        <div class="type-tag ${type1}-opacity-1">${type1}</div>
      </div>
      <img src=${spriteSrc} alt="">
    </div>
  </div>`

  else return /*html*/`
  <div class="pokemon-card-preview ${type0}"  onclick="renderBigCard(${index})">
  <h3>${pokeName}</h3>
  <div class="poke-info-preview">
    <div class="types-container">
      <div class="type-tag ${type0}-opacity-1">${type0}</div>
    </div>
    <img src=${spriteSrc} alt="">
  </div>
</div>`
}

async function renderBigCard(indexOfPokemon) {
  let overlay = document.getElementById("bigCardOverlay");
  currentShownPokemonIndex = indexOfPokemon;
  showObject(overlay);
  overlay.innerHTML = "";
  overlay.innerHTML += await bigCardHTML(currentShownPokemonIndex - 2, -2)
  overlay.innerHTML += await bigCardHTML(currentShownPokemonIndex - 1, -1);
  overlay.innerHTML += await bigCardHTML(currentShownPokemonIndex);
  overlay.innerHTML += await bigCardHTML(currentShownPokemonIndex + 1, +1)
  overlay.innerHTML += await bigCardHTML(currentShownPokemonIndex + 2, +2)

}

function showObject(object) {
  object.classList.remove("hidden");
}

function hideObject(objectID) {
  element = document.getElementById(objectID);
  element.classList.add("hidden");
}

function doNotClose(event) {
  event.stopPropagation();
}

async function bigCardHTML(index, position = 0) {
  let response = await fetch(getPokemonUrl(index));
  let responseToJson = await response.json();
  let hp = responseToJson.stats[0].base_stat;
  let attack = responseToJson.stats[1].base_stat;
  let defense = responseToJson.stats[2].base_stat;
  let speed = responseToJson.stats[5].base_stat;
  let pokeName = capitalizeFirstLetter(responseToJson.name);

  if (responseToJson.types.length > 1) {
    return /*html*/`
    <div class="big-poke-card d-flex-col" style="transform:translateX(${position * 100}%)" id="bigPokeCard_${index}" onclick="doNotClose(event)">
      <div class="poke-card-head grass-opacity-1" >
        <div class="d-flex a-center">
          <h1>#${index} ${pokeName}</h1> 
        </div>
        <div class="types-container-big d-flex">
          <div class="type-tag ${responseToJson.types[0].type.name}-opacity-1">${responseToJson.types[0].type.name}</div>
          <div class="type-tag ${responseToJson.types[1].type.name}-opacity-1">${responseToJson.types[1].type.name}</div>
        </div>
        <img src=${responseToJson.sprites.front_default} alt="">
      </div>
      <div class="arrow-container">
        <div class="arrow" onclick="changeSlide(-1)"></div>
        <div class="arrow" onclick="changeSlide(+1)"></div>
      </div>
      <div class="poke-card-body">
        <h2>Stats</h2>
        <table class="stats-container">
          <tr>
            <td class="table-name">HP</td>
            <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${hp}%) !important;"></div></div></td>
          </tr>
          <tr>
            <td class="table-name">Attack</td>
            <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${attack}%)  !important;"></div></div></td>
          </tr>
          <tr>
            <td class="table-name">Defense</td>
            <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${defense}%)  !important;"></div></div></td>
          </tr>
          <tr>
            <td class="table-name">Speed</td>
            <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${speed}%)  !important;"></div></div></td>
          </tr>
        </table>
      </div>
    </div>`
  }
  else {
    return /*html*/`
    <div class="big-poke-card d-flex-col" style="transform:translateX(${position * 100}%)" id="bigPokeCard_${index}" onclick="doNotClose(event)">
      <div class="poke-card-head grass-opacity-1">
      <h1>#${index} ${pokeName}</h1> 
        <div class="types-container-big d-flex">
          <div class="type-tag ${responseToJson.types[0].type.name}-opacity-1">${responseToJson.types[0].type.name}</div>
        </div>
        <img src=${responseToJson.sprites.front_default} alt="">
      </div>
      <div class="arrow-container">
        <div class="arrow" onclick="changeSlide(-1)"></div>
        <div class="arrow" onclick="changeSlide(+1)"></div>
      </div>
      <div class="poke-card-body">
        <h2>Stats</h2>
        <table class="stats-container">
          <tr>
            <td class="table-name">HP</td>
            <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${hp}%);"></div></div></td>
          </tr>
          <tr>
            <td class="table-name">Attack</td>
            <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${attack}%);"></div></div></td>
          </tr>
          <tr>
            <td class="table-name">Defense</td>
            <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${defense}%);"></div></div></td>
          </tr>
          <tr>
            <td class="table-name">Speed</td>
            <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${speed}%);"></div></div></td>
          </tr>
        </table>
      </div>
    </div>`
  }



}

async function changeSlide(direction) {
  let currentCard = document.getElementById(`bigPokeCard_${currentShownPokemonIndex}`);
  let previousCard = document.getElementById(`bigPokeCard_${currentShownPokemonIndex - 1}`);
  let nextCard = document.getElementById(`bigPokeCard_${currentShownPokemonIndex + 1}`);
  let previousCard2 = document.getElementById(`bigPokeCard_${currentShownPokemonIndex - 2}`);
  let nextCard2 = document.getElementById(`bigPokeCard_${currentShownPokemonIndex + 2}`);

  if (direction == +1) {
    changeTransformX(currentCard, -1);
    changeTransformX(previousCard, -2);
    changeTransformX(nextCard, 0);
    changeTransformX(previousCard2, 2)
    changeTransformX(nextCard2, 1)
    setTimeout(async () => { await renderBigCard(currentShownPokemonIndex + 1); }, 225);
  }
  else if (direction == -1) {
    changeTransformX(currentCard, 1);
    changeTransformX(nextCard, 0);
    changeTransformX(previousCard, 2);
    changeTransformX(previousCard2, -1)
    changeTransformX(nextCard2, -2)
    setTimeout(async () => { await renderBigCard(currentShownPokemonIndex - 1); }, 225);
  }
}

function changeTransformX(element, direction) {
  if (element == null) {
    console.log("NULL");
    return;
  }

  element.style = `transform:translateX(${direction * 100}%)`
  if (Math.abs(direction * 100) < 101)
    hideObject(element.id);
}
