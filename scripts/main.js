import '../styles/main.styl';
import 'react-photoswipe/lib/photoswipe.css';
import {PhotoSwipeGallery} from 'react-photoswipe';

let MainPage = React.createClass({

  getInitialState: function() {
    return {
      galleryItems: []
    };
  },

  componentDidMount(){
    this.getItems();
  },

  getItems(){
    var mainthis = this,
      section = 'hot',
      sort = 'viral',
      page = 0,
      clientID = '492ea79b2461632',
      galleryItems = [],// здесь будут объекты для PhotoSwipeGallery
      albums = [],      // здесь будут id всех альбомомв галереи
      albumIndex = [],  // здесь будут link всех картинок галереи
      imgs = [],        // здесь будут все indexes, указывающие на исходное место альбомаов в галереи
      imgIndex = [];    // здесь будут все indexes, указывающие на исходное место картинок в галереи

    //Make a request to the gallery
    //пока выполняется запрос можно добавить прелоадер (но не стала)
    fetch(`https://api.imgur.com/3/gallery/${section}/${sort}/${page}`,
      {
        dataType: 'json',
        type: 'GET',
        headers: {
          Authorization: `Client-ID ${clientID}`,
          Accept: 'application/json'
        }
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        for(let i=0; i < data.data.length; i++){
          let item = data.data[i];

          if (item.is_album) {

            albums.push(item.id); // собираем id всех альбомов галереи в отдельный массив
            albumIndex.push(i);   // запоминаем индексы альбомов, т.е. где они были в галерее

          }
          else if (!item.is_album) {

            imgs.push(item.link); // собираем ссылки всех картинок галереи в отдельный массив
            imgIndex.push(i);     // запоминаем индексы картинок, т.е. где они были в галерее
          }
        }

        for(let i=0; i < imgs.length; i++){
          //заполняем галерею картинками в том порядке,
          // в котором они были в галерее на igmur
          galleryItems[ imgIndex[i] ] = {
            src: imgs[i],
            thumbnail: imgs[i],
            w: 1200,
            h: 900,
            title: ''
          };

        }

        for(let i=0; i < albums.length; i++){
          fetch(`https://api.imgur.com/3/gallery/album/${albums[i]}`,
            {
              dataType: 'json',
              type: 'GET',
              headers: {
                Authorization: `Client-ID ${clientID}`,
                Accept: 'application/json'
              }
            })
            .then(function(response) {
              return response.json();
            })
            .then(function(data) {
              //заполняем галерею первой картинкой из альбома в том порядке,
              //в котором альбомы были в галерее на igmur
              galleryItems[ albumIndex[i] ] = {
                src: data.data.images[0].link,
                thumbnail: data.data.images[0].link,
                w: 1200,
                h: 900,
                title: ''
              };

              if(i == albums.length - 1) {
                //когда добрались до последнего альбома, то рендрим всю галерею
                //т.к. картинки в нее уже собраны
                mainthis.setState({galleryItems: galleryItems});
              }
            })
            .catch( alert );
        }
      })
      .catch( alert );
  },

  getThumbnailContent(item) {

    return (
      <img className="img" src={item.thumbnail} />
    );
  },

  render() {

    return (
      <div className="main">
        <div className="main-contentWrapper">

          <PhotoSwipeGallery items={this.state.galleryItems}
                             thumbnailContent={this.getThumbnailContent}/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<MainPage />, document.getElementById('content'));
