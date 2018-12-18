import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import 'dropify/dist/js/dropify.min.js';
import 'dropify/dist/css/dropify.min.css';
//import 'dropify/dist/fonts/*';


import ReactDOM from 'react-dom';


import index from './components/index.jsx';
import networkDataStore from './stores/networkDataStore'

ReactDOM.render(index({
  networkDataStore
}), document.getElementById('index'))
