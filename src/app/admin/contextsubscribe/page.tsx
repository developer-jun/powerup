'use client';
import { StoreProvider } from './dataContext';
import ContentContainer from './contentContainer';
import './page.scss';

export default function Page() {
  return (
    <StoreProvider>
      <div className="container">
        
        <ContentContainer />
      </div>
    </StoreProvider>
  );
}
