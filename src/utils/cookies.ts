import Cookies from 'js-cookie';

export const setCookie = (cookieName, value, days = 30) => {
  Cookies.set(cookieName, value, { expires: days });
};

export const getCookie = (cookieName) => {
  return Cookies.get(cookieName);
};

// check if cookie exists
export const cookieExists = (cookieName) => {
  return document.cookie
    .split(';')
    .some(item => item.trim().startsWith(`${cookieName}=`));
};


//Used if we want to check if the browser accepts cookie or not
export const testCookie = (cookieName, value, days = 30) => {
  try {
    Cookies.set(cookieName, value, { expires: days });
    return true;
  } catch (error) {
    console.error('Failed to set cookie:', error);
    return false;
  }
};