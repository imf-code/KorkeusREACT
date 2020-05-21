import React from 'react';
import FileOpener from './FileOpener';

class HeightVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.handleMapLoad = this.handleMapLoad.bind(this);

        this.state = {
            // Map data
            width: null,
            height: null,
            noDataValue: null,
            elevationData: null,

            // Options
            isMapLoaded: false
        }
    }

    handleMapLoad(mapObject) {
        this.setState({
            width: mapObject.width,
            height: mapObject.height,
            noDataValue: mapObject.noDataValue,
            elevationData: mapObject.elevationData,
            isMapLoaded: true
        });
    }

    render() {
        return (
            < FileOpener onMapLoad={this.handleMapLoad} />
        );
    }
}

export default HeightVisualizer;