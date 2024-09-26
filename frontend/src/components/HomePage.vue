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
                    <button type="button" title="Copy" class="col btn btn-light bi bi-copy"></button>
                    <button type="button" title="Eraser" class="col btn btn-light bi bi-eraser"></button>
                </div>
                <div class="row p-2">
                    <input type="range" class="form-range" min="1" max="20" id="customRange3" title="size"
                        v-model="size">
                </div>
                <div class="row px-2">
                    <button type="button" title="Clear All" class="col btn btn-light bi bi-paint-bucket btn-sm"
                        @click="fill"></button>
                    <input type="color" class="col form-control form-control-color" id="exampleColorInput" title="color"
                        v-model="color">
                </div>
                <hr>
                <div class="row px-2">
                    <button type="button" title="Delete" class="col btn btn-light bi bi-trash3"></button>
                    <button type="button" title="Clear All" class="col btn btn-light bi bi-x-square"
                        @click="clearAll"></button>
                </div>
                <hr>
                <div class="row px-2 pb-3">
                    <button type="button" title="import" class="col btn btn-light bi bi-upload"
                        @click="loadFile"></button>
                    <button type="button" title="save" class="col btn btn-light bi bi-download dropdown-toggle btn-sm"
                        data-bs-toggle="dropdown" aria-expanded="false"></button>
                    <ul class="dropdown-menu col-1">
                        <li class="dropdown-item" href="#" @click="saveFile"><a>JSON</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li class="dropdown-item" href="#" @click="save"><a>XML</a></li>
                    </ul>
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
            tr: null,
            mouseX: 0,
            mouseY: 0,
            hover: false,
            isDrawing: false,
            isTransforming: false,
            isColoring: false,
            drawingShapeType: '',
            drawingShape: null,
            id: 0,
            color: "#ffffff",
            size: 2,
            history: [],     // conatains screenshots(layers after each action)
            historyStep: -1,
        }
    },
    methods: {
        async loadFile() {
            const [fileHandle] = await window.showOpenFilePicker();
            const file = await fileHandle.getFile();
            const filedata = await file.text();
            this.layer = Konva.Node.create(filedata, this.stage);
            this.stage.add(this.layer)
            return file;
        },
        async saveFile() {
            const layerJSON = this.layer.toJSON();
            const jsonBlob = new Blob([layerJSON], { type: 'application/json' });
            const newHandle = await window.showSaveFilePicker();
            const writableStream = await newHandle.createWritable();
            await writableStream.write(jsonBlob);
            await writableStream.close();
        },
        startDrawing() {
            if (this.drawingShapeType == '' || this.isTransforming) return;

            this.isColoring = false;
            this.isDrawing = true;
            this.hasMoved = false;
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
            if (!this.isDrawing) return;
            this.isDrawing = false;
            console.log(this.drawingShape)
            this.isTransforming = true;
            this.startTransformation();
        },
        startTransformation() {
            console.log(this.drawingShape);
            if (!this.isTransforming) return;
            this.drawingShape.draggable(true);
            this.tr.nodes([this.drawingShape]);
            this.stage.on('click tap', (e) => {
                this.endTransformation();
            });
        },
        endTransformation() {
            this.drawingShape.draggable(false);
            this.isTransforming = false;
            this.tr.nodes([]);
            this.saveLayer();
            console.log("done babe");
            this.stage.off('click tap');
        },
        fill() {
            this.isDrawing = false;
            this.isTransforming = false;
            this.isColoring = true;
            this.drawingShapeType = '';

        },
        undo() {
            if (this.historyStep === 0) return;
            this.historyStep--;
            this.changeStageLayer();
        },
        redo() {
            if (this.historyStep === this.history.length - 1) return;
            this.historyStep++;
            this.changeStageLayer();
        },
        clearAll() {
            this.history.splice(1);
            this.historyStep = 0;
            this.changeStageLayer();
        },
        download() {
            const link = document.createElement('a');
            link.href = 'Untitled.json';
            link.download = 'YourFile.pdf'; // The name of the file to save
            link.click(); // Trigger the download
        },
        upload() {
            this.convertJsonToXml();
        },
        getMousePosition() {
            this.mouseX = this.stage.getPointerPosition().x;
            this.mouseY = this.stage.getPointerPosition().y;
        },
        createShape() {
            let shape;
            switch (this.drawingShapeType) {
                case "square":
                    shape = this.createSquare();
                    break;
                case "rectangle":
                    shape = this.createRect();
                    break;
                case "circle":
                    shape = this.createCircle();
                    break;
                case "triangle":
                    shape = this.createPolygon(3);
                    break;
                case "star":
                    shape = this.createStar();
                    break;
                case "hexagon":
                    shape = this.createPolygon(6);
                    break;
                case "pentagon":
                    shape = this.createPolygon(5);
                    break;
                case "ellipse":
                    shape = this.createEllipse();
                    break;
                case "line":
                    shape = this.createLine();
                    break;
            }
            shape.on('click', (e) => {
                if (!this.isColoring) return;
                shape.fill(this.color);
                this.saveLayer();
            })
            return shape;
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
                strokeWidth: this.size,
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
                strokeWidth: this.size,
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
                strokeWidth: this.size,
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
                strokeWidth: this.size,
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
                strokeWidth: this.size,
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
                strokeWidth: this.size,
            });
        },
        updateLine() {
            console.log(this.convertJsonToXml());
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
        saveLayer() {
            this.history.splice(this.historyStep + 1);
            let savedLayer = this.layer.clone();
            this.historyStep++;
            this.history[this.historyStep] = savedLayer;
        },
        changeStageLayer() {
            let newLayerr = this.history[this.historyStep];
            this.layer.destroy();
            this.layer = newLayerr.clone();
            this.stage.add(this.layer);
            this.stage.batchDraw();
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
        this.tr = new Konva.Transformer();
        this.layer.add(this.tr);
        // save first layer (blank one)
        this.saveLayer();

    },
}
</script>

<style scoped src="./styles/style-homepage.css"></style>