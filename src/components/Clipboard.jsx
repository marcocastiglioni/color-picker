import React from "react";
import { useEffect } from 'react';
import { getLocalStorageKeyValue } from '../utilities/utils';

function ColorPicker() {

    useEffect(() => {
        // Clipboard button event handler
        document.getElementById('clipboard').addEventListener( 'click', () => CopyClipboard() );
    }, []); 

    const CopyClipboard = ( event ) => {
        /* Get the text field */
        const selectedColor = `rgb(${getLocalStorageKeyValue('selectedColorR')}, ${getLocalStorageKeyValue('selectedColorG')}, ${getLocalStorageKeyValue('selectedColorB')})`;
        /* Copy the text inside the text field */
        navigator.clipboard.writeText( selectedColor );
    }
    return (
        <>
            {/* Clipboad */}
            <button id="clipboard">Copy RGB code to clipboard</button>
        </>
    )
}

export default ColorPicker;