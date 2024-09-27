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
                    <button type="button" title="Copy" class="col btn btn-light bi bi-copy"
                        @click="setOption('copy')"></button>
                    <input type="radio" v-model="drawingShapeType" class="btn-check" name="tools" id="tool11"
                        value="eraser">
                    <label class="col btn btn-light bi bi-eraser" for="tool11" title="Eraser"></label>
                </div>
                <div class="row p-2">
                    <input type="range" class="form-range" min="1" max="20" id="customRange3" title="size"
                        v-model="size" @change="setOption('strokewidth')">
                </div>
                <div class="row px-2">
                    <button type="button" title="Clear All" class="col btn btn-light bi bi-paint-bucket btn-sm"
                        @click="setOption('fill')"></button>
                    <input type="color" class="col form-control form-control-color" id="exampleColorInput" title="color"
                        v-model="color">
                </div>
                <hr>
                <div class="row px-2">
                    <button type="button" title="Delete" class="col btn btn-light bi bi-trash3"
                        @click="setOption('delete')"></button>
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
            option: '',
            drawingShapeType: '',
            drawingShape: null,
            selectedShape: null,
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
            if (this.drawingShapeType == '') {
                this.selectShape();
                return;
            }
            if (this.isTransforming) return;

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
            if (this.drawingShapeType == 'pencil' || this.drawingShapeType == 'eraser') return;
            this.isTransforming = true;
            this.startTransformation();
        },
        startTransformation() {
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
            this.stage.off('click tap');
        },
        selectShape() {
            this.getMousePosition();
            this.selectedShape = this.stage.getIntersection({ x: this.mouseX, y: this.mouseY });
            if (this.option != '' && this.selectedShape) this.applyOption();
        },
        applyOption() {
            switch (this.option) {
                case 'fill':
                    this.selectedShape.fill(this.color);
                    break;
                case 'copy':
                    this.drawingShape = this.selectedShape.clone();
                    this.layer.add(this.drawingShape);
                    this.isTransforming = true;
                    this.option = '';
                    this.startTransformation();
                    break;
                case 'delete':
                    this.selectedShape.destroy();
                    break;
                case 'strokewidth':
                    this.selectedShape.strokeWidth(parseInt(this.size));
                    break;
            }
            this.saveLayer();
        },
        setOption(option) {
            this.resetFlags();
            this.option = option;
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
            this.isDrawing = false;
            this.isTransforming = false;
            this.drawingShape = null;
            this.drawingShapeType = '';
            this.history.splice(1);
            this.historyStep = 0;
            this.changeStageLayer();
        },

        getMousePosition() {
            this.mouseX = this.stage.getPointerPosition().x;
            this.mouseY = this.stage.getPointerPosition().y;
        },
        resetFlags() {
            this.isDrawing = false;
            this.isTransforming = false;
            this.drawingShapeType = '';
            if(this.isTransforming) this.endTransformation();
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
                default:
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
                case "pencil":
                case "eraser":
                    this.updateBrush();
                    break;
                default:
                    this.updatePolygan();
                    break;

            }
        },

        createLine() {
            let color = 'black';
            if (this.drawingShapeType === 'eraser') color = 'white';
            return new Konva.Line({
                points: [this.mouseX, this.mouseY],
                lineCap: 'round',
                lineJoin: 'round',
                stroke: color,
                strokeWidth: parseInt(this.size),
            })
        },
        createCircle() {
            return new Konva.Circle({
                id: `${this.id}`,
                x: this.mouseX,
                y: this.mouseY,
                radius: 0,
                fill: this.color,
                stroke: 'black',
                strokeWidth: parseInt(this.size),
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
                strokeWidth: parseInt(this.size),
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
                strokeWidth: parseInt(this.size),
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
                strokeWidth: parseInt(this.size),
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
                strokeWidth: parseInt(this.size),
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
                strokeWidth: parseInt(this.size),
            });
        },
        updateBrush() {
            let points = this.drawingShape.points().concat([this.mouseX, this.mouseY]);
            this.drawingShape.points(points);
        },
        updateLine() {
            let x = this.drawingShape.points()[0];
            let y = this.drawingShape.points()[1];
            let points = [x, y, this.mouseX, this.mouseY];
            this.drawingShape.points(points);
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