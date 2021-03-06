/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  

  const response=await axios.get(" https://api.tvmaze.com/search/shows",{params:{q:query}})
  console.log(response)

  return response.data.map((element)=>{
    const id=element.show.id
    const name=element.show.name
    const summary=element.show.summary

    const image=!element.show.image?"https://tinyurl.com/tv-missing":element.show.image.original
 
    return {id,name,summary,image}
  })  
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
  
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src=${show.image}>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id="revealEpisodes">Episodes</button>
           </div>
         </div>
       </div>
       
      `);

    $showsList.append($item);
  }
}

//   }
// })

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  

  let query = $("#search-query").val();
  if (!query) return;

  // $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

  // $("#episodes-area").hide();
  document.getElementById('episodes-area').style.display = 'none';
  // $("#episodes-list").empty()
  document.querySelector("#episodes-list").innerHTML=''



});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const response=await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  console.log(response)

  // TODO: return array-of-episode-info, as described in docstring above
  return response.data.map(element => {
     return {id:element.id,name:element.name,season:element.season,number:element.number}
    
  });
}

function populateEpisodes(episodes){
  const ul=document.querySelector("#episodes-list")
  
  
  for (let episode of episodes){
    const li=document.createElement("li")
    li.innerText=`${episode.name},(season ${episode.season},number ${episode.number})`
    ul.append(li)
  }
  document.getElementById('episodes-area').style.display = 'block'; // show
  // $("#episodes-area").show();

}



document.querySelector("#shows-list").addEventListener("click",async function(event){
  if(event.target.tagName="BUTTON"){

    document.querySelector("#episodes-list").innerHTML=''

    console.log("I am a button!")
    console.log(event.target.parent)
    const id=event.target.parentElement.parentElement.getAttribute("data-show-id")
    console.log(id)
    const episodes=await getEpisodes(id)
    console.log(episodes)

    populateEpisodes(episodes)

  }
})



