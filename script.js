let pokemonCountTotal = 1008;
let chunkSize = 25;
let currentlyLoadedPokemonCount = 1;
let firstChunkLoaded = false;

function getPokemonCount() {
  return 1008;
}

async function loadNextChunk() {
  for (let i = 1; i < chunkSize + 1; i++) {
    await loadPokemon(currentlyLoadedPokemonCount);
    currentlyLoadedPokemonCount++;

  }
  firstChunkLoaded = true;
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

  await renderPokemon(index, pokeName, sprite, type0, type1);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function renderPokemon(index, pokeName, sprite, type0, type1) {
  let container = document.getElementById("pokeCardPreviewContainer");
  container.innerHTML += await cardPreviewHTML(index, pokeName, sprite, type0, type1);
}

function emptyPreviewContainer() {
  currentlyLoadedPokemonArray = [];
  let container = document.getElementById("pokeCardPreviewContainer");
  container.innerHTML = /*html*/`
  <div class="big-card-overlay hidden" id="bigCardOverlay" onclick="hideObject('bigCardOverlay')"></div>`;
}

function getPokemonUrl(index) {
  return `https://pokeapi.co/api/v2/pokemon/${index}/`
}

async function cardPreviewHTML(index, pokeName, spriteSrc, type0, type1) {

  if (type1 != undefined)
    return /*html*/`
    <div class="pokemon-card-preview ${type0}" onclick="renderBigCard(${index})" >
    <h3>${pokeName}</h3>
    <div class="poke-info-preview">
      <div class="types-container">
        <div class="type-tag ${type0}-opacity-1 "> ${capitalizeFirstLetter(type0)}</div>
        <div class="type-tag ${type1}-opacity-1"> ${capitalizeFirstLetter(type1)}</div>
      </div>
      <img src=${spriteSrc} alt="">
    </div>
  </div>`

  else return /*html*/`
  <div class="pokemon-card-preview ${type0}"  onclick="renderBigCard(${index})">
  <h3>${pokeName}</h3>
  <div class="poke-info-preview">
    <div class="types-container">
      <div class="type-tag ${type0}-opacity-1">${capitalizeFirstLetter(type0)}</div>
    </div>
    <img src=${spriteSrc} alt="">
  </div>
</div>`
}

function showObject(objectID) {
  document.getElementById(objectID).classList.remove("hidden");
}

function hideObject(objectID) {
  element = document.getElementById(objectID);
  if (element == null) console.log(objectID);
  element.classList.add("hidden");
}

function doNotClose(event) {
  event.stopPropagation();
}

function emptyBigCardHTML() {
  let bigCardOverlay = document.getElementById("bigCardOverlay");
  bigCardOverlay.innerHTML = "";
}

async function renderBigCard(indexOfPokemon) {
  emptyBigCardHTML();
  let bigCardOverlay = document.getElementById("bigCardOverlay");
  showObject("bigCardOverlay");

  let response = await fetch(getPokemonUrl(indexOfPokemon));
  let responseToJson = await response.json();
  let descriptionText = await getPokemonDescriptionText(responseToJson);

  bigCardOverlay.innerHTML += bigCardHTML(indexOfPokemon, responseToJson, descriptionText);
}

function bigCardHTML(indexOfPokemon, json, descriptionText) {
  if (json.types.length > 1)
    return /*html*/`
  <div class="big-poke-card d-flex-col"  onclick="doNotClose(event)" id=${indexOfPokemon}>
            <div class="poke-card-head  ${json.types[0].type.name}-opacity-1 " >
              <div class="d-flex a-center">
                <h1 id="pokeName_1">"${indexOfPokemon} ${capitalizeFirstLetter(json.name)}"</h1> 
              </div>
              <div class="types-container-big d-flex">
                <div class="type-tag ${json.types[0].type.name} "> ${capitalizeFirstLetter(json.types[0].type.name)}</div>
                <div class="type-tag ${json.types[1].type.name} "> ${capitalizeFirstLetter(json.types[1].type.name)}</div>
              </div>
              <img src="${json.sprites.front_default}" alt="FOTO">
            </div>
            ${pokeCardBodyHTML(json, descriptionText)}
              
          </div>`

  else return /*html*/`
          <div class="big-poke-card d-flex-col" onclick="doNotClose(event)" id=${indexOfPokemon}>
                    <div class="poke-card-head  ${json.types[0].type.name}-opacity-1 " >
                      <div class="d-flex a-center">
                        <h1 id="pokeName_1">"${indexOfPokemon} ${capitalizeFirstLetter(json.name)}"</h1> 
                      </div>
                      <div class="types-container-big d-flex">
                        <div class="type-tag ${json.types[0].type.name}"> ${capitalizeFirstLetter(json.types[0].type.name)}</div>
                      </div>
                      <img src="${json.sprites.front_default}" alt="FOTO">
                    </div>
                    ${pokeCardBodyHTML(json, descriptionText)}
                  </div>`
}

async function getPokemonDescriptionText(json) {
  const URL = json.species.url;
  let response = await fetch(URL);
  let responseToJson = await response.json();
  console.log(responseToJson.flavor_text_entries[10].flavor_text);
  return responseToJson.flavor_text_entries[10].flavor_text;
}

function pokeCardBodyHTML(json, descriptionText) {
  return /*html*/`
<div class="poke-card-body">
  <div class="poke-card-body-item hidden" id="stats_section">
   <h2>Stats</h2>
   <table class="stats-container" >
    <tr>
      <td class="table-name">HP</td>
      <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${json.stats[0].base_stat}%"></div></div></td>
    </tr>
    <tr>
      <td class="table-name">Attack</td>
      <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${json.stats[1].base_stat}%"></div></div></td>
    </tr>
    <tr>
      <td class="table-name">Defense</td>
      <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${json.stats[2].base_stat}%"></div></div></td>
    </tr>
    <tr>
      <td class="table-name">Speed</td>
      <td><div class="empty-fill" ><div class="fill"style="transform:scaleX(${json.stats[5].base_stat}%"></div></div></td>
    </tr>
  </table>
</div>

<div class="poke-card-body-item" id="about_section">
  <h2>About</h2>
  <p>${descriptionText}</p>
</div>
<ul class="poke-card-body-list">
<li class="${json.types[0].type.name}" onclick="showPokeCardBodyItem('stats')">
  STATS
</li>
  
<li class="${json.types[0].type.name}" onclick="showPokeCardBodyItem('about')">
  ABOUT
</li>  
</ul>

</div>`
}

function showPokeCardBodyItem(itemName) {
  switch (itemName) {
    case "about":
      showObject(`about_section`);
      hideObject(`stats_section`);
      break;

    case "stats":
      showObject(`stats_section`);
      hideObject(`about_section`);
      break;
  }

}

function setTypes(json, indexOfCard) {
  const type0 = document.getElementById(`typeTag_${indexOfCard}_0`);
  const type1 = document.getElementById(`typeTag_${indexOfCard}_1`);

  type0.innerHTML = json.types[0].type.name;
  type0.classList = `type-tag ${json.types[0].type.name}`

  if (json.types.length < 2) {
    type1.classList.add("hidden");
  }
  else {
    type1.classList.remove("hidden");
    type1.innerHTML = json.types[1].type.name;
    type1.classList = `type-tag ${json.types[1].type.name}`
  }
}

function toggleDisplayNone(distance, elementID) {
  if (Math.abs(distance) > 200) {
    setTimeout(hideObject(elementID), 250);
  } else showObject(elementID);
}

async function searchForPokemon() {
  let input = document.getElementById("searchInput");
  let inputValue = input.value.toLowerCase();

  if (inputValue == "") {
    loadFirstChunk()
  }
  else {
    emptyPreviewContainer();
    loadEveryPokemonToLoad();
  }

  toggleLoadButton()

  async function loadEveryPokemonToLoad() {
    for (let i = 1; i < await getPokemonCount(); i++) {
      let inputValueNew = input.value.toLowerCase()
      if (inputValueNew == "") break;

      let response = await fetch(getPokemonUrl(i));
      if (response.status != 200) continue;

      let responseToJson = await response.json();
      let pokeName = capitalizeFirstLetter(responseToJson.name);

      if (pokeName.toLowerCase().includes(inputValue)) {
        loadPokemon(i);
      }
    }
  }
}

function toggleLoadButton() {
  let button = document.getElementById("loadButton");
  let input = document.getElementById("searchInput");
  let inputValue = input.value.toLowerCase();
  if (inputValue != "") {
    button.classList.add("hidden");
  }
  else
    button.classList.remove("hidden");
}

function loadFirstChunk() {
  emptyPreviewContainer();
  currentlyLoadedPokemonCount = 1;
  loadNextChunk();
}

