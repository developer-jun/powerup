import React, {memo} from 'react';
function Title() {
  console.log ("Title Rendering");
  return (
    <div>
      <h2> useCallBack hook</h2>
    </div>
  );
}
export default memo(Title);