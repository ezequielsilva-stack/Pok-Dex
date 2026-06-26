const pokemonName = document.querySelector('.pokemon-name');
const pokemonNumber = document.querySelector('.pokemon-number');
const pokemonImage = document.querySelector('.pokemon-image');
const pokemonType = document.querySelector('.pokemon-type')

const form = document.querySelector('.form');
const input = document.querySelector('.input-pkd');
const prev = document.querySelector('.btn-prev')
const next = document.querySelector('.btn-next')
const btnFavorite = document.querySelector('.btn-favorite');
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

const audioClick = new Audio('./sound/click.mp3');
const audioSearch = new Audio('./sound/search.mp3');
const audioNotFound = new Audio('./sound/notfound.mp3');
const audioFavorite = new Audio('./sound/favorite.mp3')

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let searchPokemon = 1;
let searchName = ''
const fatPokemon = async(pokemon)=>{
    const apiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if(apiResponse.status === 200){

        const data = await apiResponse.json();
        return data;

    };

}

const render = async (pokemon) => {

    pokemonName.innerHTML = '...loading'
    const data = await fatPokemon(pokemon);
    if (data){

        pokemonImage.style.display = 'block' 
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        searchPokemon = data.id;
        searchName = data.name;

        pokemonType.textContent = data.types
            .map(type => type.type.name)
            .join(' / ');


        input.value = '';
    }else{
        audioSearch.pause()
        pokemonType.textContent = ''
        pokemonImage.style.display = 'none' 
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = '';
        audioNotFound.play();
    };
};

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    render(input.value.toLowerCase());
    audioSearch.play();
});

prev.addEventListener('click', ()=>{
    if(searchPokemon >1){
        searchPokemon -= 1;
        render(searchPokemon);
        audioClick.play();
    };
});

next.addEventListener('click', ()=>{
    searchPokemon+= 1;
    render(searchPokemon);
    audioClick.play();
});
btnFavorite.addEventListener('click', ()=>{

    const nomeAtual = pokemonName.textContent;
    console.log(pokemonName.textContent)
    if(!favorites.includes(nomeAtual)){

        favorites.push(nomeAtual);

        localStorage.setItem(
            'favorites',
            JSON.stringify(favorites)
        );
        audioFavorite.play();
        favoritePokemon();

    };

});
function favoritePokemon (){
    const favoriteUl = document.querySelector('.favorites-list');
    favoriteUl.innerHTML = '';

    favorites.forEach(pokemon =>{

        const li = document.createElement('li');
        li.classList.add('list-Favorites');
        li.textContent = pokemon;

        favoriteUl.appendChild(li);
        removerFavorito(li);
    });
};
function removerFavorito(li){

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('btn-remove');
    buttonDelete.innerHTML = 'Remover';
    li.appendChild(buttonDelete);
};
document.addEventListener('click', function(e){
    const el = e.target;

    if(el.classList.contains('btn-remove')){

        const li = el.parentElement;
        const nomePokemon = li.firstChild.textContent;
        const index = favorites.indexOf(nomePokemon);

        if(index !== -1){
            favorites.splice(index, 1);
        }

        console.log('DEPOIS:', favorites);

        localStorage.setItem(
            'favorites',
            JSON.stringify(favorites)
        );
        li.remove();
        audioClick.play();
    }
});
menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});
document.querySelector('#menu-favorites').addEventListener('click', ()=>{

    document.querySelector('.favorites-list')
        .classList.toggle('hidden');

});
document.querySelector('#menu-theme').addEventListener('click', ()=>{

    document.body.classList.toggle('dark');

});
render(searchPokemon);
favoritePokemon();
