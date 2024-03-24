'use client';
import './page.scss';
import {Provider} from '@/app/admin/contexts/createFastContext';
import ContentContainer from './contentContainer';

function App() {
  return (
    <Provider>
      <div className="container">
        <h5>App</h5>
        <ContentContainer />
      </div>
    </Provider>
  );
}

export default App;