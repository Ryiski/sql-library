const searchInput = document.querySelector('.form-control');
const searchButton = document.querySelector('.input-group-append button'); 
const searchlist = document.querySelector('#list'); 
const adSearchLayer = document.querySelector('#ad-search-layer');
const adSearchButton = document.querySelector('#ad-search-button'); 
let hasValue; //document with classname of has-value
let adSearchInputs; //advanced Search inputs
let query; //url query
let inputValues = ["", "", "", ""];//advanced search values


//search title
searchInput.addEventListener('keyup',async (e)=>{
    if(e.target.value === ""){

        searchlist.innerHTML = "";
        searchlist.style.display = 'none';

    }else if(e.target.value.match(/^[A-Za-z0-9_]+/)){

        const data = await fetch(`/live-search?title=${e.target.value.toLowerCase()}`)
        .then(res => res.json());
        let list;

        //ternary operator
        data.length === 0?
        list = [`<li>Sorry book not found</li>`]:
        list = data.map(val => 
        `<li><a href="/books/${val.id}">${val.title}</a></li><hr>`);
        
        searchlist.style.display = '';
        searchlist.innerHTML = `<ul>${list.join('')}</ul>`;

    }
})

//show Advanced Search
adSearchButton.addEventListener('click', ()=>{adSearchLayer.style.display = '';})

adSearchLayer.addEventListener('keyup', (e) => {
    let numFound; //number of found books
    adSearchInputs = document.querySelectorAll('#ad-search-form input');
    inputValues = [];
    adSearchInputs.forEach(input => {
        inputValues.push(input.value);
    });
    
    const querys = {
        title:inputValues[0],
        author:inputValues[1],
        genre:inputValues[2],
        year:inputValues[3],
    }
    
    query = '?';
    
    for(let key in querys){
        if(querys[key].trim() !== ""){
            query += `&${key}=${querys[key].trim()}`;
        }else{
            query += `&${key}=`;
        }
    }
    
    if(e.target.tageName = 'INPUT'){

        e.target.value.trim() != ""?
        e.target.className = "has-value": 
        e.target.className = "";   

        fetch(`/get-count${query}`)
        .then(res => res.json())
        .then(data => {
            hasValue = document.querySelectorAll('.has-value');

            hasValue.length > 0?
            numFound = data:
            numFound = 0;

            document.querySelector('#total-found').innerHTML = `Match's Found : ${numFound}`;
        });
    }
});

searchButton.addEventListener('click',(e)=> {if(searchInput.value === "")e.preventDefault()});

document.querySelector('#ad-search-close')
.addEventListener('click', ()=>{
    adSearchLayer.style.display = 'none';
    adSearchInputs = document.querySelectorAll('#ad-search-form input');

    //reset inputs
    adSearchInputs.forEach(input => {
        input.value = "";
    });

});

document.querySelector('#ad-search-form button')
.addEventListener('click',(e)=>{
    if(hasValue === undefined || hasValue.length === 0) e.preventDefault();   
});