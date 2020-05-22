// Turning elevation values into RGB values

import React from 'react';

class Color extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();

        this.state = {
            elevationColorData: [],
            isMapCalculated: false
        }
    }

    componentDidUpdate() {
        const parentState = this.props.parentState;
        if (parentState.newMap) {
            this.setState({ isMapCalculated: false });
        }
        if (parentState.isMapLoaded && !this.state.isMapCalculated) {
            console.log(this.props);
            this.CalculateRGBValues();
            this.props.colorUpdate();
        }
        if (this.state.isMapCalculated) {
            console.log('perkele');
            this.Canvas();
        }
    }

    /** Calculate RGB values */
    CalculateRGBValues() {

        // Calculate RGB values based on the max range of elevations
        console.log('Calculating RGB values...')
        console.log(this.props.parentState);
        const map = this.props.parentState;
        let minValue = this.getMin(map.elevationData);
        let maxValue = this.getMax(map.elevationData);
        let mapRange = maxValue - minValue;

        let calculatedValues = map.elevationData.map(item => Math.round(((item - minValue) / mapRange) * 255));
        this.setState({ isMapCalculated: true, elevationColorData: [...calculatedValues] });
        console.log('Done.');
    }

    /** Create canvas imagedata and draw the map on it, in coloring.js */
    Canvas() {
        const map = this.props.parentState;

        // Create canvas imagedata
        console.log("Drawing the map...");
        let mapCanvas = this.canvasRef.current;
        let mapContext = mapCanvas.getContext("2d");

        mapCanvas.width = map.width;
        mapCanvas.height = map.height;

        let mapImageData = mapContext.createImageData(map.width, map.height);
        let noData = 0;
        let mainColor = 1;
        let secondColor = 2;
        let colorAlpha = 255;
        let defaultRGBValue = 0;


        for (let i = 0; i < mapImageData.data.length; i++) {
            let n = i * 4;
            mapImageData.data[n + noData] = isNaN(this.state.elevationColorData[i]) ? 255 : defaultRGBValue;
            mapImageData.data[n + mainColor] = this.state.elevationColorData[i];
            mapImageData.data[n + secondColor] = defaultRGBValue;
            mapImageData.data[n + 3] = colorAlpha;
        }


        // Single color
        /*
        if (isMonoColor || colorSettingsMain == colorSettingsSecond) {
            for (let i = 0; i < mapImageData.data.length; i++) {
                let n = i * 4;
                mapImageData.data[n + noData] = isNaN(elevationColorData[i]) ? 255 : defaultRGBValue;
                mapImageData.data[n + mainColor] = elevationColorData[i];
                mapImageData.data[n + secondColor] = defaultRGBValue;
                mapImageData.data[n + 3] = colorAlpha;
            }
        }

        // Two different colors
        else {
            for (let i = 0; i < mapImageData.data.length; i++) {
                let n = i * 4;
                mapImageData.data[n + noData] = isNaN(elevationColorData[i]) ? 255 : 0;
                mapImageData.data[n + mainColor] = elevationColorData[i] > colorDivider ? elevationColorData[i] : defaultRGBValue;
                mapImageData.data[n + secondColor] = elevationColorData[i] <= colorDivider ? elevationColorData[i] : defaultRGBValue;
                mapImageData.data[n + 3] = colorAlpha;
            }
        }
        */

        // Draw imagedata to canvas
        mapContext.putImageData(mapImageData, 0, 0)
        console.log("Done")
    }

    /** Set colors based on user settings, in coloring.js */
    /*
    ParseColorSettings() {

        // Set color divider
        colorDivider = Math.round(((waterLevel - minValue) / mapRange) * 255);

        // Set main color
        switch (colorSettingsMain) {
            case "red":
                mainColor = 0;
                secondColor = 1;
                noData = 2;
                break;
            case "green":
                mainColor = 1;
                secondColor = 2;
                noData = 0;
                break;
            case "blue":
                mainColor = 2;
                secondColor = 1;
                noData = 0;
                break;
            default:
                throw "Error with color settings: Main color not set.";
                break;
        }

        // Two colored map
        if (!(isMonoColor || colorSettingsMain == colorSettingsSecond)) {
            switch (colorSettingsSecond) {
                case "red":
                    secondColor = 0;
                    break;
                case "green":
                    secondColor = 1;
                    break;
                case "blue":
                    secondColor = 2;
                    break;
                default:
                    throw "Error with color settings: Second color not set.";
                    break;
            }

            // Set NODATA value
            if (!(mainColor == 0 || secondColor == 0)) {
                noData = 0;
            }
            else if (!(mainColor == 1 && secondColor == 1)) {
                noData = 1;
            }
            else if (!(mainColor == 2 && secondColor == 2)) {
                noData = 2;
            }
            else {
                throw "Error with color settings: Couldn't set color for NODATA.";
            }
        }
    }
    */

    /** Min/max functions for more data than Math.max/min can handle */
    getMax(arr) {
        let len = arr.length;
        let max = -Infinity;

        while (len--) {
            max = arr[len] > max ? arr[len] : max;
        }
        return max;
    }

    /** Min/max functions for more data than Math.max/min can handle */
    getMin(arr) {
        let len = arr.length;
        let min = Infinity;

        while (len--) {
            min = arr[len] < min ? arr[len] : min;
        }
        return min;
    }

    render() {
        const map = this.props.parentState;

        return (
            <div>
                <canvas height={map.height} width={map.width} ref={this.canvasRef}></canvas>
                <br />
            </div>
        );
    }
}

export default Color;