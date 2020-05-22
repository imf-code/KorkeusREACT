import React from 'react';
import FileOpener from './FileOpener';
import Color from './Color';

class HeightVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleColor = this.handleColor.bind(this);

        this.state = {
            // Map data
            width: null,
            height: null,
            noDataValue: null,
            elevationData: null,

            // 
            isMapLoaded: false,
            newMap: false
        }
    }

    handleMapLoad(mapObject) {
        this.setState({
            width: mapObject.width,
            height: mapObject.height,
            noDataValue: mapObject.noDataValue,
            elevationData: mapObject.elevationData,
            isMapLoaded: true,
            newMap: true
        });
    }

    handleColor() {
        console.log('asdf');
        this.setState({
            newMap: false
        });
    }

    render() {
        return (
            <div>
                < Color parentState={this.state} colorUpdate={this.handleColor} />
                < FileOpener onMapLoad={this.handleMapLoad} />
            </div>
        );
    }
}

export default HeightVisualizer;