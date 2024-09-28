<template>
    <div class="row px-2 pt-3">
        <button type="button" title="undo" class="col btn btn-light bi-arrow-counterclockwise" @click="undo"></button>
        <button type="button" title="redo" class="col btn btn-light bi-arrow-clockwise" @click="redo"></button>
    </div>
    <hr>
    <div class="row row-cols-2 px-2">
        <ShapeButton v-for="(shape, index) in shapes" v-model="typeValue" :key="index" :id="'shape' + (index + 1)"
            :title="shape.value" :symbol="shape.symbol">
        </ShapeButton>
    </div>
    <hr>
    <div class="row px-2 ">
        <button type="button" title="Copy" class="col btn btn-light bi bi-copy" @click="setOption('copy')"></button>
        <input type="radio" v-model="typeValue" class="btn-check" name="tools" id="tool11" value="eraser">
        <label class="col btn btn-light bi bi-eraser" for="tool11" title="Eraser"></label>
    </div>
    <div class="row p-2">
        <input type="range" class="form-range" min="1" max="20" id="customRange3" title="size"
            v-model="strokewidthValue" @change="setOption('strokewidth')">
    </div>
    <div class="row px-2">
        <button type="button" title="Clear All" class="col btn btn-light bi bi-paint-bucket btn-sm"
            @click="setOption('fill')"></button>
        <input type="color" class="col form-control form-control-color" id="exampleColorInput" title="color"
            v-model="colorValue">
    </div>
    <hr>
    <div class="row px-2">
        <button type="button" title="Delete" class="col btn btn-light bi bi-trash3"
            @click="setOption('delete')"></button>
        <button type="button" title="Clear All" class="col btn btn-light bi bi-x-square" @click="clearAll"></button>
    </div>
    <hr>
    <div class="row px-2 pb-3">
        <button type="button" title="import" class="col btn btn-light bi bi-upload" @click="loadFile"></button>
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
</template>
<script>
import ShapeButton from './ShapeButton.vue';
export default {
    components: {
        ShapeButton
    },
    data() {
        return {
            shapes: [
                { value: 'pencil', symbol: '✎' },
                { value: 'line', symbol: '╱' },
                { value: 'circle', symbol: '〇' },
                { value: 'square', symbol: '☐' },
                { value: 'rectangle', symbol: '▭' },
                { value: 'triangle', symbol: '△', },
                { value: 'ellipse', symbol: '⬭' },
                { value: 'pentagon', symbol: '⬠' },
                { value: 'hexagon', symbol: '⬡' },
                { value: 'star', symbol: '☆' },
            ]
        }
    },
    props: ['type', 'strokewidth', 'color'],
    emits: ['update:type', 'update:strokewidth', 'update:color', 'undo', 'redo', 'setOption', 'clearAll', 'load', 'save'],
    computed: {
        typeValue: {
            get() {
                return this.type
            },
            set(type) {
                this.$emit('update:type', type)
            }
        },
        strokewidthValue: {
            get() {
                return this.strokewidth
            },
            set(strokewidth) {
                this.$emit('update:strokewidth', strokewidth)
            }
        },
        colorValue: {
            get() {
                return this.color
            },
            set(color) {
                this.$emit('update:color', color)
            }
        }
    },
    methods: {
        undo() {
            this.$emit('undo');
        },
        redo() {
            this.$emit('redo');
        },
        setOption(option) {
            this.$emit('setOption', option);
        },
        clearAll() {
            this.$emit('clearAll');
        },
        loadFile() {
            this.$emit('load');
        },
        saveFile() {
            this.$emit('save');
        },

    }
}
</script>
<style scoped src="../styles/style-homepage.css"></style>