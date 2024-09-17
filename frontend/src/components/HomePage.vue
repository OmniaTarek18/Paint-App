<template>
    <div class="background container-fluid p-5 h-100">
        <div class="row justify-content-evenly">
            <div class="col-1 toolbar">
                <div class="row px-2 pt-3">
                    <button type="button" title="undo" class="col btn btn-light bi-arrow-counterclockwise"
                        @click="undo"></button>
                    <button type="button" title="redo" class="col btn btn-light bi-arrow-clockwise"
                        @click="redo"></button>
                </div>
                <hr>
                <div class="row row-cols-2 px-2">
                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool1"
                        value="pencil">
                    <label class="col btn btn-light" for="tool1" title="Pencil">✎</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool2"
                        value="line">
                    <label class="col btn btn-light" for="tool2" title="Line">╱</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool3"
                        value="circle">
                    <label class="col btn btn-light" for="tool3" title="Circle">〇</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool4"
                        value="square">
                    <label class="col btn btn-light" for="tool4" title="Square">☐</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool5"
                        value="rectangle">
                    <label class="col btn btn-light" for="tool5" title="Rectangle">▭</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool6"
                        value="triangle">
                    <label class="col btn btn-light" for="tool6" title="Triangle">△</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool7"
                        value="ellipse">
                    <label class="col btn btn-light" for="tool7" title="Ellipse">⬭</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool8"
                        value="pentagon">
                    <label class="col btn btn-light" for="tool8" title="Pentagon">⬠</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool9"
                        value="hexagon">
                    <label class="col btn btn-light" for="tool9" title="Hexagon">⬡</label>

                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool10"
                        value="star">
                    <label class="col btn btn-light" for="tool10" title="Star">☆</label>
                </div>
                <hr>
                <div class="row px-2 ">
                    <button type="button" title="Clear All" class="col btn btn-light bi bi-x-square"></button>
                    <button type="button" title="Eraser" class="col btn btn-light bi bi-eraser"></button>
                </div>
                <div class="row p-2">
                    <input type="range" class="form-range" min="1" max="20" id="customRange3" title="stroke width"
                        v-model="strokeWidth">
                </div>
                <div class="row px-2">
                    <input type="color" class="col form-control form-control-color" id="exampleColorInput" title="color"
                        v-model="color">
                </div>
                <hr>
                <div class="row px-2">
                    <button type="button" title="Delete" class="col btn btn-light bi bi-trash3"></button>
                    <button type="button" title="Copy" class="col btn btn-light bi bi-copy"></button>
                </div>
                <hr>
                <div class="row px-2 pb-3">
                    <button type="button" title="import" class="col btn btn-light bi bi-upload"></button>
                    <button type="button" title="save" class="col btn btn-light bi bi-download"></button>
                </div>
            </div>
            <div class="col-9 p-0 board" id="board" @mousedown="startDrawing" @mouseup="stopDrawing"
                @mousemove="updateDrawing">
            </div>
        </div>
    </div>
</template>

<script>
import Konva from "konva";
export default {
    data() {
        return {
            stage: null,
            layer: null,
            mouseX: 0,
            mouseY: 0,
            hover: false,
            isDrawing: false,
            drawingShapeType: '',
            drawingShape: null,
            id: 0,
            color: "#ffffff",
            strokeWidth: 2,
            history: [],     // conatains screenshots(layers after each action)
            historyStep: -1,
        }
    },
    methods: {
        draw(type) {
            this.drawingShapeType = type;
        },
        startDrawing() {
            this.isDrawing = true;
            // intialize the shape and add it to the layer
            this.getMousePosition();
            this.drawingShape = this.createShape();
            this.layer.add(this.drawingShape);
            this.layer.batchDraw();
            this.id++;

        },
        updateDrawing() {
            if (!this.isDrawing || this.drawingShape == null) return;
            this.getMousePosition();
            this.updateShape();
            this.layer.batchDraw();

        },
        stopDrawing() {
            this.isDrawing = false;
            this.saveLayer();

        },
        undo() {
            if (this.historyStep === 0) return;
            this.historyStep--;
            let previousLayer = this.history[this.historyStep];
            this.layer.destroy();
            this.layer = previousLayer.clone();
            this.stage.add(this.layer);

            this.stage.batchDraw();
        },

        redo() {
            if (this.historyStep === this.history.length-1) return;
            this.historyStep++;
            let nextLayer = this.history[this.historyStep];
            this.layer.destroy();
            this.layer = nextLayer.clone();
            this.stage.add(this.layer);

            this.stage.batchDraw();
        },
        saveLayer() {
            let savedLayer = this.layer.clone();
            this.historyStep++;
            this.history[this.historyStep] = savedLayer;
        },
        getMousePosition() {
            this.mouseX = this.stage.getPointerPosition().x;
            this.mouseY = this.stage.getPointerPosition().y;
        },




        createShape() {
            switch (this.drawingShapeType) {
                case "square":
                    return this.createSquare();
                case "rectangle":
                    return this.createRect();
                case "circle":
                    return this.createCircle();
                case "triangle":
                    return this.createPolygon(3);
                case "star":
                    return this.createStar();
                case "hexagon":
                    return this.createPolygon(6);
                case "pentagon":
                    return this.createPolygon(5);
                case "ellipse":
                    return this.createEllipse();
                case "line":
                    return this.createLine();
            }
        }
        ,
        updateShape() {
            switch (this.drawingShapeType) {
                case "square":
                    this.updateSquare();
                    break;
                case "rectangle":
                    this.updateRect();
                    break;
                case "star":
                    this.updateStar();
                    break;
                case "ellipse":
                    this.updateEllipse();
                    break;
                case "line":
                    this.updateLine();
                    break;
                default:
                    this.updatePolygan();

            }
        },

        createLine() {

        },
        createCircle() {
            return new Konva.Circle({
                id: `${this.id}`,
                x: this.mouseX,
                y: this.mouseY,
                radius: 0,
                fill: this.color,
                stroke: 'black',
                strokeWidth: this.strokeWidth,
            });
        },
        createSquare() {
            return new Konva.Rect({
                id: `${this.id}`,
                x: this.mouseX,
                y: this.mouseY,
                width: 0,
                height: 0,
                fill: this.color,
                stroke: 'black',
                strokeWidth: this.strokeWidth,
            });
        },
        createRect() {
            return new Konva.Rect({
                id: `${this.id}`,
                x: this.mouseX,
                y: this.mouseY,
                width: 0,
                height: 0,
                fill: this.color,
                stroke: 'black',
                strokeWidth: this.strokeWidth,
            });
        },
        createEllipse() {
            return new Konva.Ellipse({
                id: `${this.id}`,
                x: this.mouseX,
                y: this.mouseY,
                radiusX: 0,
                radiusY: 0,
                fill: this.color,
                stroke: 'black',
                strokeWidth: this.strokeWidth,
            })
        },
        createPolygon(numberOfSides) {
            return new Konva.RegularPolygon({
                id: `${this.id}`,
                x: this.mouseX,
                y: this.mouseY,
                sides: numberOfSides,
                radius: 0,
                fill: this.color,
                stroke: 'black',
                strokeWidth: this.strokeWidth,
            });
        },
        createStar() {
            return new Konva.Star({
                id: `${this.id}`,
                x: this.mouseX,
                y: this.mouseY,
                numPoints: 5,
                innerRadius: 0,
                outerRadius: 0,
                fill: this.color,
                stroke: 'black',
                strokeWidth: this.strokeWidth,
            });
        },
        updateLine() {

        },
        updateSquare() {
            let width = this.mouseX - this.drawingShape.x();
            let height = this.mouseY - this.drawingShape.y();
            let side = (width + height) / 2;
            this.drawingShape.width(side);
            this.drawingShape.height(side);
        },
        updateRect() {
            let width = this.mouseX - this.drawingShape.x();
            let height = this.mouseY - this.drawingShape.y();
            this.drawingShape.width(width);
            this.drawingShape.height(height);
        },
        updatePolygan() {
            let x = this.mouseX - this.drawingShape.x();
            let y = this.mouseY - this.drawingShape.y();
            let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            this.drawingShape.radius(radius);
        },
        updateEllipse() {
            let x = this.mouseX - this.drawingShape.x();
            let y = this.mouseY - this.drawingShape.y();
            this.drawingShape.radiusX(Math.abs(x));
            this.drawingShape.radiusY(Math.abs(y));
        },
        updateStar() {
            let x = this.mouseX - this.drawingShape.x();
            let y = this.mouseY - this.drawingShape.y();
            let innerRadius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            this.drawingShape.innerRadius(innerRadius);
            this.drawingShape.outerRadius(innerRadius * 2.5);
        },
        setStageSize() {
            // to ensure that shapes won't come out the board 
            const board = document.getElementById("board"); // need to be done after render the elements 
            const width = board.offsetWidth;
            const height = board.offsetHeight;
            this.stage = new Konva.Stage({
                container: 'board',
                width: width,
                height: height,
            });
        }
    },
    mounted() {
        this.setStageSize();
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        // save first layer (blank one)
        this.saveLayer();

    },
}
</script>

<style>
.board {
    background-color: #f6f8fa;
    border-radius: 5px;
}

.toolbar {
    background-color: #f6f8fa;
    border-color: rgb(255, 193, 7);
    border-width: 10px;
    border-radius: 5px;
}
</style>