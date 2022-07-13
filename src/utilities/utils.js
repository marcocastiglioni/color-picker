// Local Storage: Check if it's supported
export const isLocalStorageSupported = () => {
    return (typeof(Storage) !== "undefined");
}

// Local Storage: get the value of a specific key
// If not valid or not value then return falsy value
export const getLocalStorageKeyValue = ( key ) => {
    if ( !isLocalStorageSupported ) return false;

    return localStorage.getItem( key ) !== null || localStorage.getItem( key ) !== '' ? localStorage.getItem( key ) : false;
}

// Local Storage: set the value of a specific key
export const setLocalStorageKeyValue = ( key , value ) => {
    // Check if Local Storage is supported by the browser and 
    // store the RGB combination for next page load
    if ( isLocalStorageSupported ) localStorage.setItem( key, value );
}
