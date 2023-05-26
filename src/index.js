import NewImg from './js/API.js';
import Notiflix from 'notiflix';
import LoadBt from './js/load-button.js'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const newImg = new NewImg();
const loadBt = new LoadBt({
    selector: ".load-more",
    isHidden: true,
})

const refs = {
    searchForm: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
}



refs.searchForm.addEventListener('submit', searchImg);
loadBt.button.addEventListener("click", fetchArticles);



async function searchImg(evt) {
    evt.preventDefault();
    const input = evt.currentTarget.elements.searchQuery.value.trim();
    if (input === '') {
        clearAll();
        return;
    }
    newImg.query = input;
    newImg.resetPage();      
    loadBt.show();
    
     
    fetchArticles()
}   


 

async function fetchArticles() { 
    
    loadBt.disable();
    
    try {
        const markup = await getArticlesMarkup();
        if (!markup) {
      loadBt.hide();
      return    }
        if (!markup) throw new Error("No data"); 
    updateNewsList(markup);
        
    
  } catch (err) {
    onError(err);
  }
    loadBt.enable();

}


async function getArticlesMarkup() {
    try {
        const data = await newImg.imageAPI();
        if (data.totalHits === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.');
        }else{
            console.log(data)
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            if (data.hits.length === 0 || data.hits.length >= data.totalHits ) {
                loadBt.hide  
                showEndOfResultsMessage();
            }
            return data.hits.reduce((markup, hit) => markup + createPlate(hit), "");
        }
    }catch (err) {
        onError(err)
        return null

    }
}



function createPlate({webformatURL,largeImageURL,tags,likes,views,comments,downloads,
}) {
    clearAll();
    return  `<a class="gallery__link" href="${largeImageURL}" data-lightbox="gallery" data-title="${tags}">
       <div class="photo-card">
                <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                    <b>Likes</b>
                    ${likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b>
                    ${views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                    </p>
                </div>
                </div>
                </a>`
}

const lightbox = new SimpleLightbox('.gallery a');
function updateNewsList(markup) {
    refs.gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
}



function onError(err) {
    console.error(err);
    loadBt.hide();
    clearAll();
}


function clearAll() {
  refs.gallery.innerHTML = '';
}

function showEndOfResultsMessage() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}