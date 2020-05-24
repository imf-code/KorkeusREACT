import React from 'react';
import MapCanvas from './MapCanvas';

/** Visualize an array of height values */
class Color extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            elevationColorData: [],
            coloredMapImageData: null,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.parentState.elevationData !== this.props.parentState.elevationData) {
            this.setState({
                elevationColorData: this.CalculateRGBValues()
            });
        }
        if (prevState.elevationColorData !== this.state.elevationColorData) {
            this.setState({
                coloredMapImageData: this.DrawMap()
            });
        }
    }

    /** Calculate color intensity based on height values */
    CalculateRGBValues() {
        console.log('Calculating RGB values...')
        const map = this.props.parentState;
        let minValue = this.getMin(map.elevationData);
        let maxValue = this.getMax(map.elevationData);
        let mapRange = maxValue - minValue;

        let calculatedValues = map.elevationData.map(item => Math.round(((item - minValue) / mapRange) * 255));

        console.log('Done.');
        return calculatedValues;
    }

    /** Create canvas ImageData and 'draw' the colorized map on it */
    DrawMap() {
        const map = this.props.parentState;

        console.log('Drawing the map...');
        let mapImageData = new ImageData(map.width, map.height);
        let colorValues = [0, 255, 0];


        for (let i = 0; i < mapImageData.data.length; i++) {
            let n = i * 4;
            mapImageData.data[n + 0] = isNaN(this.state.elevationColorData[i]) ? 255 - colorValues[0] : colorValues[0];
            mapImageData.data[n + 1] = isNaN(this.state.elevationColorData[i]) ? 255 - colorValues[1] : colorValues[1];
            mapImageData.data[n + 2] = isNaN(this.state.elevationColorData[i]) ? 255 - colorValues[2] : colorValues[2];
            mapImageData.data[n + 3] = this.state.elevationColorData[i];
        }

        console.log('Done')
        return mapImageData;
    }

    /** Set colors based on user settings */
    /*
    ParseColorSettings() {
    
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
                <MapCanvas width={map.width} height={map.height} image={this.state.coloredMapImageData} />
            </div>

        );
    }
}

export default Color;