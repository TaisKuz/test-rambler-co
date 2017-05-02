import '../styles/main.styl';
import $ from 'jquery';
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
    //make request to API and render when all of items are ready

    var mainthis = this,
      section = 'hot',
      sort = 'viral',
      page = 0,
      clientID = '492ea79b2461632',
      galleryItems = []; //Here there will be pictures

    //Make a request to the gallery
    $.ajax({
      url: `https://api.imgur.com/3/gallery/${section}/${sort}/${page}`,
      dataType: 'json',
      type: 'GET',
      headers: {
        Authorization: `Client-ID ${clientID}`,
        Accept: 'application/json'
      },

      success: function(data){

        galleryItems = data.data.map((item, index) => {

          var objItem = {}; //Object with a description of the picture for PhotoSwipeGallery

          //If this is an album we make ajax request for the first picture from the album
          if (item.is_album === true) {
            // but it is ready too late
            // and I faild to do ajax request with promise
            // How can it be fixed?
            objItem = getImgFromAlbum(item.id)
              .then(
                (response) => {
                  return response;
                },
                error => console.log(`Rejected: ${error}`)
              );
          }
          else if (item.is_album === false) {

              objItem =
              {
                src: item.link,
                thumbnail: item.link,
                w: 1200,
                h: 900,
                title: item.title
              };
          }

            return(objItem);
         });

        // ajax request with promise
        function getImgFromAlbum(itemId) {

          return new Promise(function(resolve, reject) {
            $.ajax({
              url: `https://api.imgur.com/3/gallery/album/${itemId}`,
              dataType: 'json',
              type: 'GET',
              headers: {
                Authorization: `Client-ID ${clientID}`,
                Accept: 'application/json'
              },
            }).done(function(data) {

              resolve({
                src: data.data.images[0].link,
                thumbnail: data.data.images[0].link,
                w: 1200,
                h: 900,
                title: ''
              });
            }).fail(function(error) {

              reject(error);
            });
          });
        }

        //set state and re render when items are ready
        // but it is ready too early
        mainthis.setState({galleryItems: galleryItems});
      },
      error: function(data){
        console.log('error', data);
      }
    });
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
