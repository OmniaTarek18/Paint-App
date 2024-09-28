<template>
    <div class="background container-fluid p-5 h-100">
        <div class="row justify-content-evenly">
            <div class="col-1 toolbar">
                <ToolBar 
                v-model:type="drawingShapeType"
                v-model:color="color"
                v-model:strokewidth="size"
                @undo="undo"
                @redo="redo"
                @load="loadFile"
                @save="saveFile"
                @set-option="setOption"
                @clear-all="clearAll">

                </ToolBar>
            </div>
            <div class="col-9 p-0 board" id="board" @mousedown="startDrawing" @mouseup="stopDrawing"
                @mousemove="updateDrawing">
            </div>
        </div>

    </div>

</template>

<script>
import Konva from "konva";
import { createShape, updateShape } from "../utility functions/drawing";
import ToolBar from "./ToolBar.vue";
export default {
    components:{
        ToolBar
    },
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
            drawingShapeType: 'pencil',
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
            this.drawingShape = createShape(this.drawingShapeType, this.mouseX, this.mouseY, this.size, this.color, this.id);
            this.layer.add(this.drawingShape);
            this.layer.batchDraw();
            this.id++;
        },
        updateDrawing() {
            if (!this.isDrawing || this.drawingShape == null) return;
            this.getMousePosition();
            updateShape(this.drawingShapeType, this.drawingShape, this.mouseX, this.mouseY);
            this.layer.batchDraw();
        },
        stopDrawing() {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            if (this.drawingShapeType == 'pencil' || this.drawingShapeType == 'eraser') {
                this.saveLayer();
                return;
            };
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
                    this.cloneShape();
                    this.option = '';
                    this.isTransforming = true;
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
        cloneShape() {
            this.drawingShape = this.selectedShape.clone();
            console.log("done")
            this.layer.add(this.drawingShape);
            this.layer.batchDraw();
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
            this.drawingShapeType = '';
            if (this.isTransforming) this.endTransformation();
        },

        saveLayer() {
            this.history.splice(this.historyStep + 1);
            let savedLayer = this.layer.clone();
            this.historyStep++;
            this.history[this.historyStep] = savedLayer;
        },
        changeStageLayer() {
            this.tr.destroy();
            let newLayerr = this.history[this.historyStep];
            this.layer.destroy();
            this.layer = newLayerr.clone();
            this.stage.add(this.layer);
            this.tr = new Konva.Transformer();
            this.layer.add(this.tr);
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

<style scoped src="../styles/style-homepage.css"></style>