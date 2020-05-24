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
        this.setState({
            newMap: false
        });
    }

    render() {
        return (
            <div>
                < FileOpener onMapLoad={this.handleMapLoad} />
                <br />
                < Color parentState={this.state} colorUpdate={this.handleColor} />
            </div>
        );
    }
}

export default HeightVisualizer;