import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '36649090-4d16cd3dbc9897f2d77116260';
const imgType = "photo";
const orientation = 'horizontal';
const safesearch = "true";


export default class NewImg {
constructor() {
    this.page = 1;
    this.query = "";
    this.per_page = 40;
  }

    async  imageAPI() {
    const  {data}  = await axios.get(`${URL}?key=${KEY}&q=${this.query}&image_type=${imgType}&orientation=${orientation}&safesearch=${safesearch}&per_page=${this.per_page}&page=${this.page}`);
    this.incrementPage();
    return data;
}

resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}

