import NewImg from './js/API.js';
import Notiflix from 'notiflix';
/* import LoadBt from './js/load-button.js' */
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 500;


const newImg = new NewImg();
/* const loadBt = new LoadBt({
    selector: ".load-more",
    isHidden: true,
}) */

const refs = {
    searchForm: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
}



refs.searchForm.addEventListener('submit', searchImg);
/* loadBt.button.addEventListener("click", fetchPhotos); */



async function searchImg(evt) {
    evt.preventDefault();
    const input = evt.currentTarget.elements.searchQuery.value.trim();
    if (input === '') {
        clearAll();
        /* loadBt.hide(); */
        Notiflix.Report.warning('Ooops..Add search request!');
        return 
    }
    newImg.query = input;
    newImg.resetPage();      
    
    window.addEventListener('scroll', handleScrollDeb);
    /* loadBt.show(); */
    
     
    fetchPhotos()
}   

async function getPicMarkup() {
    try {
        const data = await newImg.imageAPI();
        if (data.totalHits === 0) {
            clearAll()
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else {
            console.log(data)
            if (data.hits.length === 0|| data.hits.length >= data.totalHits ) {
                /* loadBt.hide() */
                window.removeEventListener('scroll', handleScrollDeb);
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                return;
            }
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            return data.hits.reduce((markup, hit) => markup + createPlate(hit), "");
        }
    }catch (err) {
        onError(err)
        return  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")

    }
}


async function fetchPhotos() { 
    /* loadBt.disable(); */
     if (newImg.page * newImg.perPage >= newImg.totalHits) {
    window.removeEventListener('scroll', handleScrollDeb);
    Notiflix.Notify.info("Извините, но вы достигли конца результатов поиска.");
    return;
  }

    window.addEventListener('scroll', handleScrollDeb);
    try {
        const markup = await getPicMarkup();
      if (!markup) throw new Error("No data"); 
       
    updateNewsList(markup);
  } catch (err) {
    onError(err);
  }
    /* loadBt.enable(); */
}


 

function createPlate({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) {
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
    window.removeEventListener('scroll', handleScrollDeb);

    /* loadBt.hide(); */
    /* clearAll(); */
}


function clearAll() {
  refs.gallery.innerHTML = '';
}


const handleScrollDeb = debounce(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 1) {
    fetchPhotos();
  }
}, DEBOUNCE_DELAY);
window.addEventListener('scroll', handleScrollDeb);