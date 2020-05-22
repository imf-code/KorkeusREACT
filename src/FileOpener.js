// Reading and initial parsing of elevation data from .asc file

import React from 'react';

class FileOpener extends React.Component {
    constructor(props) {
        super(props);

        this.handleTheFile = this.handleTheFile.bind(this);
        this.inputFile = React.createRef();
    }

    /** Open user file and read it as text */
    handleTheFile(event) {
        event.preventDefault();

        // Confirm file extension and read the data as text
        console.log('Reading the file...');
        let fileName = this.inputFile.current.files[0].name;
        if (!fileName.endsWith('.asc')) {
            console.error('Error opening the file: Invalid file extension, .asc expected.');
            return;
        }
        let file = this.inputFile.current.files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
            console.log('Done.');
            this.ParseTheData(event.target.result);
        }
        reader.onerror = () => {
            console.error('Error opening the file: Cannot read file.');
            return;
        }
        reader.readAsText(file);
    }

    /** Read metadata and convert string to a float array */
    ParseTheData(dataString) {

        // Try to read necessary metadata from the string
        const parseError = new Error('Error reading the data: Metadata not found.');
        let map = {
            width: null,
            height: null,
            noDataValue: null,
            elevationData: null
        }

        try {
            console.log('Reading metadata...');
            map.width = dataString.match(/(?<=^ncols\s*)\d+/);
            if (map.width === null) {
                throw parseError;
            }
            map.height = dataString.match(/(?<=nrows\s*)\d+/);
            if (map.height === null) {
                throw parseError;
            }
            map.noDataValue = dataString.match(/(?<=NODATA_value\s*)-?\d*\.\d+/);
            if (map.noDataValue === null) {
                throw parseError;
            }
        }
        catch (err) {
            console.error(err.message);
            return;
        }

        // Separate elevation data from metadata, only numbers should remain afterwards
        let findTheMatrixRegex = new RegExp('(?<=' + map.noDataValue.toString() + '\\s*)-?\\d+');
        let indexOfMatrix = dataString.search(findTheMatrixRegex);
        map.elevationData = dataString.slice(indexOfMatrix);
        console.log('Done.');

        // Turn into an array, check if array size matches metadata
        console.log('Converting to array...');
        map.elevationData = map.elevationData.replace(/\r?\n/g, "");
        map.elevationData = map.elevationData.split(" ");
        console.log('Done.');

        if (map.elevationData.length !== map.height * map.width) {
            console.log('Error: Unexpected map size.');
            return;
        }

        // Convert to float, change NODATA values to NaN
        console.log('Converting to float...');
        map.elevationData = map.elevationData.map(parseFloat);

        map.noDataValue = parseFloat(map.noDataValue);
        map.elevationData.forEach((_item, index, arr) => {
            if (arr[index] === map.noDataValue) {
                arr[index] = NaN;
            }
        });

        console.log('Done.');

        // Pass parsed map to parent
        this.props.onMapLoad(map);
    }

    // File input form
    render() {
        return (
            <div>
                <form onSubmit={this.handleTheFile}>
                    <label>Valitse .asc -tiedosto:</label>
                    <br />
                    <input type='file' ref={this.inputFile} />
                    <br />
                    <button type='submit'>Submit</button>
                </form>
            </div>
        );
    }
}

export default FileOpener;