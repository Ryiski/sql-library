const searchInput = document.querySelector('.form-control');
const searchlist = document.querySelector('#list'); 
searchlist.style.display = 'none';

searchInput.addEventListener('keyup',async (e)=>{
    console.log(e.target.value === "");
    if(e.target.value === ""){

        searchlist.innerHTML = "";
        searchlist.style.display = 'none';

    }else if(e.target.value.match(/^[A-Za-z0-9_]+/)){
        const data = await fetch(`/search?q=${e.target.value.toLowerCase()}`)
        .then(res => res.json());
        console.log(data)
        let list;
        data.length === 0?
        list = [`<li>Sorry book not found</li>`]:
        list = data.map(val => 
        `<li><a href="/books/${val.id}">${val.title}</a></li><hr>`);
        searchlist.style.display = '';
        searchlist.innerHTML = `<ul>${list.join('')}</ul>`;
    }
    
})

