import React from "react";
import { useEffect } from 'react';
import { getLocalStorageKeyValue, setLocalStorageKeyValue } from '../utilities/utils';
import './ColorPicker.scss';

function ColorPicker() {
    
    useEffect(() => {
        // Cache the canvas DOM element
        const shadePickerElem = document.getElementById('shade-picker');
        const colorBarElem = document.getElementById('color-bar');
        const inputR = document.getElementById('color-red');
        const inputG = document.getElementById('color-green');
        const inputB = document.getElementById('color-blue');
        const clipboard = document.getElementById('clipboard');

        // Initializing colors
        // Check if local storage is supported and if there were previous RGB values stored before loading the page
        const baseColorR = getLocalStorageKeyValue('baseColorR') || '0';
        const baseColorG = getLocalStorageKeyValue('baseColorG') || '255';
        const baseColorB = getLocalStorageKeyValue('baseColorB') || '0';
        const selectedColorR = getLocalStorageKeyValue('selectedColorR') || '';
        const selectedColorG = getLocalStorageKeyValue('selectedColorG') || '';
        const selectedColorB = getLocalStorageKeyValue('selectedColorB') || '';
        const pointerPositionX = getLocalStorageKeyValue('pointerPositionX') || '0';
        const pointerPositionY = getLocalStorageKeyValue('pointerPositionY') || '0';
        const colorBarIndicatorPos = getLocalStorageKeyValue( 'colorBarIndicatorPos' ) || '0';

        // Initialize the Color Picker by using horizontal and vertical gradient
        FillCanvas( shadePickerElem, `rgb(${baseColorR},${baseColorG},${baseColorB})` );

        // Initialize the Color Bar in one way gradient
        let colorsArr = [ '#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00' ];
        FillCanvasLinearGradient( colorBarElem, colorsArr );
        document.getElementById('color-bar-indicator').style.left = colorBarIndicatorPos;
        
        // Set the pointer position within the shade picker as per Local Storage
        SetPointerPosition( pointerPositionX, pointerPositionY );

        // Display the RGB values of the selected color within the output labels
        PrintOutputValues( selectedColorR, selectedColorG, selectedColorB );
        
        // Event Listeners:
        // (1) when clicking over the shade picker to get the color and set outputs
        shadePickerElem.addEventListener( 'click', event => GetColorFromShadePicker( event ));

        // (2) when clicking over the color bar to change the base color of the shade picker
        colorBarElem.addEventListener( 'click', event => GetColorFromBar( event ));

        // (3) When changing input values
        inputR.addEventListener( 'change', event => GetNewInputValue( event, 'selectedColorR' ));
        inputG.addEventListener( 'change', event => GetNewInputValue( event, 'selectedColorG' ));
        inputB.addEventListener( 'change', event => GetNewInputValue( event, 'selectedColorB' ));

    }, []); 

    const FillCanvas = ( canvasElem, baseColor ) => {
        // Set the canvas initial color for the vertical gradient from transparent to black
        let colorsArr = [ baseColor, `rgb(255,255,255)` ];
        FillCanvasLinearGradient( canvasElem, colorsArr, true);

        // and horizontal gradient from white to colorH
        colorsArr = [ 'rgb(0,0,0)', 'rgba(0,0,0,0)' ];
        FillCanvasLinearGradient( canvasElem, colorsArr );
    }

    const FillCanvasLinearGradient = ( canvasElem, colorsArr, isVerticalOrientation = false ) => {
        const ctx = canvasElem.getContext('2d');

        const gradient = isVerticalOrientation 
            ? ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
            : ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);

        colorsArr.forEach( (color, index, colorsArr) => {
            gradient.addColorStop( index * ( 1 / ( colorsArr.length - 1 )), color )
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    const PrintOutputValues = ( colorR, colorG, colorB ) => {
        document.getElementById('color-red').value = colorR;
        document.getElementById('color-green').value = colorG;
        document.getElementById('color-blue').value = colorB;
    }

    const GetPixelColor = event => {
        const pos = GetMousePos( event );
        const ctx = event.target.getContext('2d');
        const color = ctx.getImageData( pos.x, pos.y, 1, 1 )['data'];  // Read pixel Color
        return color;
    }

    const GetMousePos = event => {
        var rect = event.target.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    }

    const GetColorFromShadePicker = event => {
        const pixel = GetPixelColor( event );
        const pos = GetMousePos( event);

        // Display RGB values within the output labels
        PrintOutputValues( pixel[0], pixel[1], pixel[2] );

        // Set the position of the cross-pointer within the shade picker
        SetPointerPosition( pos.x, pos.y );
        
        // Store the RGB values in local storage for next page load
        setLocalStorageKeyValue( 'selectedColorR', pixel[0] );
        setLocalStorageKeyValue( 'selectedColorG', pixel[1] );
        setLocalStorageKeyValue( 'selectedColorB', pixel[2] );
        setLocalStorageKeyValue( 'pointerPositionX', pos.x );
        setLocalStorageKeyValue( 'pointerPositionY', pos.y );
    }

    const GetColorFromBar = event => {
        // Cache the Shade Picker DOM element
        const shadePickerElem = document.getElementById('shade-picker');
        const pixel = GetPixelColor( event );
        FillCanvas( shadePickerElem, `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`, `rgb(255,255,255)` );

        // Display RGB values within the output labels
        PrintOutputValues( pixel[0], pixel[1], pixel[2] );

        // Change the position of the color bar indicator
        const pos = GetMousePos( event );
        document.getElementById('color-bar-indicator').style.left = `${pos.x}px`;

        // Store new RGB values values in Local Storage for next page load
        setLocalStorageKeyValue( 'selectedColorR', pixel[0] );
        setLocalStorageKeyValue( 'selectedColorG', pixel[1] );
        setLocalStorageKeyValue( 'selectedColorB', pixel[2] );
        setLocalStorageKeyValue( 'baseColorR', pixel[0] );
        setLocalStorageKeyValue( 'baseColorG', pixel[1] );
        setLocalStorageKeyValue( 'baseColorB', pixel[2] );
        setLocalStorageKeyValue( 'colorBarIndicatorPos', `${pos.x}px` );
    }

    const SetPointerPosition = ( valueX, valueY ) => {
        let pointer = document.getElementById('shade-picker-pointer');
        const left = parseInt(getComputedStyle(pointer, ':before').left, 10);
        const top = parseInt(getComputedStyle(pointer, ':after').top, 10);
        
        pointer.style.left = `${valueX - left}px`;
        pointer.style.top = `${valueY - top}px`;
    }

    // Event Listener: To validate and Fill canvas when inputs value change
    const GetNewInputValue = ( event, localStorageKey ) => {
        
        setLocalStorageKeyValue( localStorageKey, event.target.value );

        const selectedColorR = getLocalStorageKeyValue('selectedColorR') || '';
        const selectedColorG = getLocalStorageKeyValue('selectedColorG') || '';
        const selectedColorB = getLocalStorageKeyValue('selectedColorB') || '';

        FillCanvas( document.getElementById('shade-picker'), `rgb(${selectedColorR},${selectedColorG},${selectedColorB})` );

    }

    return (
        <div className="c-color-picker">

            <div className="c-color-picker__canvas-area">
                <canvas id="shade-picker" className="c-color-picker__square-shade" width="300px" height="300px"></canvas>
                <span id="shade-picker-pointer" className="c-color-picker__picker-pointer"></span>

                <div className="c-color-picker__bar-pointer-container">
                    <canvas id="color-bar" className="c-color-picker__color_bar" width="300px" height="30px"></canvas>
                    <span id="color-bar-indicator" className="c-color-picker__bar-pointer"></span>
                </div>
            </div>

            <div className="c-color-picker__output-values">
                <p><b>R</b> <input type="text" id="color-red" /></p>
                <p><b>G</b> <input type="text" id="color-green" /></p>
                <p><b>B</b> <input type="text" id="color-blue" /></p>
            </div>
            
        </div>
    )
}

export default ColorPicker;