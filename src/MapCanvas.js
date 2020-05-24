import React from 'react';
import './MapCanvas.css';

/** Draws given ImageData object on a html canvas element with added functionality. */
class MapCanvas extends React.Component {
    constructor(props) {
        super(props);

        this.hiddenCanvasRef = React.createRef();
        this.visibleCanvasRef = React.createRef();

        this.AddDragEvent = this.AddDragEvent.bind(this);
        this.RemoveDragEvent = this.RemoveDragEvent.bind(this);
        this.DragEvent = this.DragEvent.bind(this);
        this.WindowResizeEvent = this.WindowResizeEvent.bind(this);

        this.state = {
            canvasWidth: 0,
            canvasHeight: 0
        }
    }

    componentDidMount() {

        // Adds panning and resize functionality
        let canvas = this.visibleCanvasRef.current;  
        canvas.addEventListener('mousedown', this.AddDragEvent);
        canvas.addEventListener('mouseout', this.RemoveDragEvent);
        canvas.addEventListener('mouseup', this.RemoveDragEvent);
        window.addEventListener('resize', this.WindowResizeEvent);
    }

    componentWillUnmount() {
        let canvas = this.visibleCanvasRef.current;
        canvas.removeEventListener('mousedown', this.AddDragEvent);
        canvas.removeEventListener('mouseout', this.RemoveDragEvent);
        canvas.removeEventListener('mouseup', this.RemoveDragEvent);
        window.removeEventListener('resize', this.WindowResizeEvent);
    }

    AddDragEvent() { this.visibleCanvasRef.current.addEventListener('mousemove', this.DragEvent); }

    RemoveDragEvent() { this.visibleCanvasRef.current.removeEventListener('mousemove', this.DragEvent); }

    DragEvent(event) {
        let canvas = this.visibleCanvasRef.current;
        let ctx = canvas.getContext('2d');
        let map = this.hiddenCanvasRef.current;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, map.width, map.height);

        ctx.translate(event.movementX, event.movementY);

        if (ctx.getTransform().e < -(map.width - this.state.canvasWidth) ||
            ctx.getTransform().e > 0) {

            ctx.translate(-event.movementX, 0);
        }
        if (ctx.getTransform().f < -(map.height - this.state.canvasHeight) ||
            ctx.getTransform().f > 0) {

            ctx.translate(0, -event.movementY);
        }

        this.UpdateVisible();
    };

    WindowResizeEvent() {
        this.setState({
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.image !== this.props.image) {
            this.hiddenCanvasRef.current.getContext('2d').putImageData(this.props.image, 0, 0);
            this.setState({
                canvasWidth: window.innerWidth,
                canvasHeight: window.innerHeight
            });
        }
        this.UpdateVisible();
    }

    /** Draw hidden canvas on visible canvas */
    UpdateVisible() {
        let visible = this.visibleCanvasRef.current;
        let vctx = visible.getContext('2d');

        vctx.fillStyle = 'black';
        vctx.fillRect(0, 0, this.props.width, this.props.height)
        vctx.drawImage(this.hiddenCanvasRef.current, 0, 0);
    }

    render() {

        return (
            <div>
                <canvas width={this.props.width} height={this.props.height} ref={this.hiddenCanvasRef} style={{ display: 'none' }}></canvas>
                <canvas width={this.state.canvasWidth} height={this.state.canvasHeight - 150} ref={this.visibleCanvasRef} style={{ userSelect: 'none' }}></canvas>
            </div >
        )
    }
}

export default MapCanvas;