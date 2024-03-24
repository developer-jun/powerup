'use client';

import './page.scss';
import {Provider} from "../contexts/storageContext";
import ContentContainer from "./ui/mainContainer";

const dataStructure = {
  first: '',
  last: '',
  role: 'guest',
}
function App() {
  return (
    <Provider defaultValue={dataStructure}>
      <div className="container">
        <h5>App</h5>
        
        <ContentContainer />
      </div>
    </Provider>
  );
}

export default App;