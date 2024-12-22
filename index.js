// Function to fetch Pokémon data
//https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0
async function fetchPokemonData(url) {
   
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }  
}
// Function to Search for a Pokemon
async function PokemonSearch(){
   const searchBar = document.getElementById('searchBar');
   const query = searchBar.value.toLowerCase().trim();
   if(query){
   const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${query}`
   try{
    const pokemon = await fetchPokemonData(pokemonUrl);
    if(pokemon){
        displayPokemonSearch(pokemon)
    }else{
        displayError("Pokemon not found. Please check name or id and try again");
    }
   }catch(error){
    console.log('Error fetching Pokmeon data: ',error);
    displayError("Error fetching Pokemon data.")
   }
   } else{
    displayError("Please enter a Pokemon name or Id.")
   }
}
// Function to display the searched Pokemon
function displayPokemonSearch(pokemon){
  const searchResult = document.querySelector('.search-results');
  searchResult.innerHTML = ""
  const pokemonCard = document.createElement('div');
  pokemonCard.className = "pokemon-card";
  pokemonCard.innerHTML =
   `
  <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"/>
  <h2>ID: ${pokemon.name}</h2>
  <p>Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
  `;
  searchResult.appendChild(pokemonCard);
}
// Function to get all Pokemon
async function AllPokemon(){
     const allPokemonUrl = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
     try {
        const pokemonList = await fetchPokemonData(allPokemonUrl);
        if(pokemonList){
            const allPokemonDetails = await Promise.all(pokemonList.results.map(async pokemon =>{
                return await fetchPokemonData(pokemon.url)
            }))
            displayAllPokemon(allPokemonDetails)
        }else{
            displayError("Seems like we're still trying to catch'em all..")
        }
     } catch (error) {
        console.log("Error fetching data for Pokedex: ", error);
        displayError("Looks like we couldn't catch'em all....");
     }
}
// Function to display all Pokemon
function displayAllPokemon(pokemonList){
    const pokemonGrid = document.querySelector(".pokemon-grid");
    pokemonGrid.innerHTML = ""
    pokemonList.forEach(pokemon=>{
        const pokemonCard = document.createElement('div');
        pokemonCard.className = "pokemon-card"
        pokemonCard.innerHTML= `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"/>
        <h2>${pokemon.name}</h2>
        <p>ID: ${pokemon.id}</p>
        <p>Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        `;
        pokemonGrid.appendChild(pokemonCard);
    })
}
// Function to display Error messages 
function displayError(message){
   const searchResult =  document.querySelector('.search-results');
   searchResult.innerHTML = `<p class="error">${message}</p>`;
}
AllPokemon();
document.getElementById('searchBar').addEventListener('input',PokemonSearch)