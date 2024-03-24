"use client"

import { useRef, useState } from 'react';
import "./page.scss";
import GuestInfo from '@/components/test/guestInfo';
import Counter from '@/components/test/counter/counter';
export const metadata = {
  title: 'Admin Dashboard',
  description: 'welcome administrator',
}

const initState = {tabs: [true, false, false]};

export default function Test() {
  const initialState = { count: 0 }
  const [state, setState] = useState(initState);

  const authUser = {
    data: {
      id: 123,
      name: 'Jun'
    }
  };
  const hotelGuest = {
    name: 'Jun',
    age: 39,
    checkInData: {
      checkInDate: '2021-01-01',
      checkInTime: '12:00:00',
      checkOutDate: '2021-01-01',
      checkOutTime: '12:00:00',
      room: {
        id: 101,
        type: 'deluxe',
        rate: 500
      }
    }
  }

  const tabbed = (tabIndex: number) => {
    console.log("tabstate: ", state.tabs);
    const activeTab = state.tabs.map( (tab, index) => (tabIndex === index) ? true : false);
    console.log("tabs: ", activeTab);
    setState({...state, tabs: activeTab});    
  }

  return (
    <main className='test-page'>
      <div className='counter-container'>
        <Counter />          
      </div>

      <div>
      </div>
      <GuestInfo user={authUser} guest={hotelGuest}  />
      


      {/* Tabs */}
      <div className="tabs">
        <div className="tab-controls">
          <button className={`tab-button ${state.tabs[0] && ('active')}`} onClick={e=>tabbed(0)}>Tab 1</button>
          <button className={`tab-button ${state.tabs[1] && ('active')}`} onClick={e=>tabbed(1)}>Tab 2</button>
          <button className={`tab-button ${state.tabs[2] && ('active')}`} onClick={e=>tabbed(2)}>Tab 3</button>
        </div>
        
        <div id="tab1" className={`tab-content ${state.tabs[0] && ('active')}`}>
          Content for Tab 1
        </div>
        <div id="tab2" className={`tab-content ${state.tabs[1] && ('active')}`}>
          Content for Tab 2
        </div>
        <div id="tab3" className={`tab-content ${state.tabs[2] && ('active')}`}>
          Content for Tab 3
        </div>
      </div>
    </main>
  )
}
