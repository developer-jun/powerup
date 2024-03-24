'use client';
import Display from './display';
import useStore from './useStore';

const DisplayContainer = () => {
  const {getData} = useStore();
  const {first, last} = getData('user');
  console.log('local state: ',first, last);
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      {/*<Display value="first" />
      <Display value="last" />*/}
      First Name: {first}<br />
      Last Name: {last}
    </div>
  );
};

export default DisplayContainer;