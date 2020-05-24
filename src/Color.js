// Turning elevation values into RGB values

import React from 'react';

class Color extends React.Component {
    constructor(props) {
        super(props);

        this.hiddenCanvasRef = React.createRef();
        this.visibleCanvasRef = React.createRef();

        this.AddDragEvent = this.AddDragEvent.bind(this);
        this.RemoveDragEvent = this.RemoveDragEvent.bind(this);
        this.DragEvent = this.DragEvent.bind(this);

        this.state = {
            elevationColorData: [],
            isMapCalculated: false
        }
    }

    componentDidMount() {

        // Enable click and drag
        let canvas = this.visibleCanvasRef.current;

        canvas.addEventListener('mousedown', this.AddDragEvent);
        canvas.addEventListener('mouseout', this.RemoveDragEvent);
        canvas.addEventListener('mouseup', this.RemoveDragEvent);
    }

    componentWillUnmount() {
        let canvas = this.visibleCanvasRef.current;
        canvas.removeEventListener('mousedown', this.AddDragEvent);
    }

    AddDragEvent() { this.visibleCanvasRef.current.addEventListener('mousemove', this.DragEvent); }

    RemoveDragEvent() { this.visibleCanvasRef.current.removeEventListener('mousemove', this.DragEvent); }

    DragEvent(event) {

        let canvas = this.visibleCanvasRef.current;
        let ctx = canvas.getContext('2d');
        let map = this.props.parentState;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, map.width, map.height);

        ctx.translate(event.movementX, event.movementY);

        if (ctx.getTransform().e < -(map.width - canvas.width) ||
            ctx.getTransform().e > 0) {

            ctx.translate(-event.movementX, 0);
        }
        if (ctx.getTransform().f < -(map.height - canvas.height) ||
            ctx.getTransform().f > 0) {

            ctx.translate(0, -event.movementY);
        }

        this.UpdateMap();
    };

    componentDidUpdate() {
        const parentState = this.props.parentState;
        if (parentState.newMap) {
            this.setState({ isMapCalculated: false });
        }
        if (parentState.isMapLoaded && !this.state.isMapCalculated) {
            this.CalculateRGBValues();
            this.props.colorUpdate();
        }
        if (this.state.isMapCalculated) {
            this.DrawMap();
        }
    }

    /** Calculate RGB values */
    CalculateRGBValues() {

        // Calculate RGB values based on the max range of elevations
        console.log('Calculating RGB values...')
        const map = this.props.parentState;
        let minValue = this.getMin(map.elevationData);
        let maxValue = this.getMax(map.elevationData);
        let mapRange = maxValue - minValue;

        let calculatedValues = map.elevationData.map(item => Math.round(((item - minValue) / mapRange) * 255));
        this.setState({ isMapCalculated: true, elevationColorData: [...calculatedValues] });
        console.log('Done.');
    }

    /** Colorize and draw map on offscreen canvas */
    DrawMap() {
        const map = this.props.parentState;

        // Create canvas imagedata
        console.log("Drawing the map...");
        let mapCanvas = this.hiddenCanvasRef.current;
        let mapContext = mapCanvas.getContext("2d");

        mapCanvas.width = map.width;
        mapCanvas.height = map.height;

        let mapImageData = mapContext.createImageData(map.width, map.height);
        let colorValues = [0, 255, 0];


        for (let i = 0; i < mapImageData.data.length; i++) {
            let n = i * 4;
            mapImageData.data[n + 0] = isNaN(this.state.elevationColorData[i]) ? 255 - colorValues[0] : colorValues[0];
            mapImageData.data[n + 1] = isNaN(this.state.elevationColorData[i]) ? 255 - colorValues[1] : colorValues[1];
            mapImageData.data[n + 2] = isNaN(this.state.elevationColorData[i]) ? 255 - colorValues[2] : colorValues[2];
            mapImageData.data[n + 3] = this.state.elevationColorData[i];
        }

        // Draw imagedata to canvas
        mapContext.putImageData(mapImageData, 0, 0);
        this.UpdateMap();

        console.log("Done")
    }

    /** Draw hidden canvas on visible canvas */
    UpdateMap() {
        let visible = this.visibleCanvasRef.current;
        let vctx = visible.getContext('2d');

        vctx.fillStyle = 'black';
        vctx.fillRect(0, 0, this.props.parentState.width, this.props.parentState.height)
        vctx.drawImage(this.hiddenCanvasRef.current, 0, 0);
    }

    /** Set colors based on user settings, in coloring.js */
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
        const hiddenCanvas = {
            display: 'none'
        }

        return (
            <div>
                <canvas width={map.width} height={map.height} ref={this.hiddenCanvasRef} style={hiddenCanvas}></canvas>
                <canvas width={window.innerWidth} height={window.innerHeight - 200} ref={this.visibleCanvasRef}></canvas>
                <br />
            </div>
        );
    }
}

export default Color;