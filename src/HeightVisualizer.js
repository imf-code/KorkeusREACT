import React from 'react';
import FileOpener from './FileOpener';
import Color from './Color';

class HeightVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.handleMapLoad = this.handleMapLoad.bind(this);

        this.state = {
            width: 0,
            height: 0,
            noDataValue: null,
            elevationData: null
        }
    }

    /** Set map data after file opening */
    handleMapLoad(mapObject) {
        this.setState({
            width: mapObject.width,
            height: mapObject.height,
            noDataValue: mapObject.noDataValue,
            elevationData: mapObject.elevationData,
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