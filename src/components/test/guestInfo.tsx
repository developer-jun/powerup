import { useEffect } from "react";

export default function GuestInfo(props: {user: unknown, guest: unknown}) {
  

  useEffect(() => {

    console.log("props.guest:",props.guest);
    // TASK: check to see if room id exists and console.log it out.
    // MUST not have any typescript data type warnings

    // Step: 1. Check if hotelGuest is an object and not undefined
    // Step: 2. Check if 
    if(   typeof props.guest === 'object' && props.guest && "checkInData" in props.guest 
       && typeof props.guest.checkInData === 'object' && props.guest.checkInData &&  "room" in props.guest.checkInData
       && typeof props.guest.checkInData.room === 'object' && props.guest.checkInData.room &&  "id" in props.guest.checkInData.room) {
        console.log("Guest: ", props.guest.name);
        console.log("Room: ", props.guest.checkInData.room.id); // got this one right
      }
    //   && typeof props.guest.checkInData.room === 'object' && props.guest.checkInData.room)  {
    // }


    // if(Object.hasOwn(props, "data"))
    //   console.log("gender",Object.hasOwn(props.data, "gender"));
    
    // console.log("id", Object.hasOwn(props.val.data, "id"));
    // 1. Let's do a type guard against the userData object, no need to check props since we know it will always be an abject.
    if (typeof props.user === 'object' && props.user !== null) {
      console.log("user id in: ", 'id' in props.user);
      // 2. Let's extract userData object from props since we know it exists and not null.
      // note that props.userData is just a props reference and referring to our original object was named user. user object still has one property called data and is the holder of our information.
      let userInfo = (props.user as { [key: string]: unknown })['data']; // this method is called type assertions, we are extracting the property 'data' from object props.userData. So it's basically: props.userData['data'];
      // should we have used props.userData['data'] instead of the whole line above, will it work?
      // the answer is yes, but typescript will complain, because props.userData is now of type any. It doesn't know if the data variable really exists.
      // same with simply doing props.userData.data, type will tell us data does not exist on props.userData.
      // okay, so what will happen to the above code if data does not exists on props.userData?
      // based on the above, typescript will try and create the object, if it finds the object then great, if not, it will just be undefined.
      // in short, we let typescript do the extraction of the object for us.
      // Now we know what to expect next, that is to check if the variable we had TS create exists or not.
      console.log("props.data:", props.user.data);
      console.log("data:", userInfo);
      // 3. Check if the object was successfully extracted
      if (typeof userInfo === 'object' && userInfo !== null) {
        // we successfully extracted the object, now it's time to check if the property exists.
        console.log("id: ", userInfo.id);
        console.log("id", Object.hasOwn(userInfo, 'id'));
        console.log("id", userInfo.hasOwnProperty('id'));
        if (Object.hasOwn(userInfo, 'id')) {
          // 'nestedObject' is guaranteed to be an object and has 'propertyName' as its own property
          console.log("id: ", userInfo.id);
        }
      }
    }

  },[]);

  return (
    <div>
      <h1>Guest Info</h1>
    </div>
  )
}