<script>
export default {
    data() {
        return {
            count: 0
        }
    }
}
</script>

<template>
    <div class="background container-fluid p-5 h-100" >
        <div class="row justify-content-evenly">
            <div class="col-1 toolbar">
                <div class="row px-2 pt-3">
                    <button type="button" title="undo" class="col btn btn-light bi-arrow-counterclockwise"></button>
                    <button type="button" title="redo" class="col btn btn-light bi-arrow-clockwise"></button>
                </div>
                <hr>
                <div class="row row-cols-2 px-2">
                    <button type="button" class="col btn btn-light " title="Pencil">✎</button>
                    <button type="button" class="col btn btn-light" title="Line">╱</button>
                    <button type="button" class="col btn btn-light" title="Circle">〇</button>
                    <button type="button" class="col btn btn-light" title="Square">☐</button>
                    <button type="button" class="col btn btn-light" title="Rectangle">▭</button>
                    <button type="button" class="col btn btn-light" title="Triangle">△</button>
                    <button type="button" class="col btn btn-light" title="Ellipse">⬭</button>
                    <button type="button" class="col btn btn-light" title="Pentagon">⬠</button>
                    <button type="button" class="col btn btn-light" title="Hexagon">⬡</button>
                    <button type="button" class="col btn btn-light" title="Star">☆</button>
                </div>
                <hr>
                <div class="row px-2 ">
                    <button type="button" title="Clear All" class="col btn btn-light bi bi-x-square"></button>
                    <button type="button" title="Eraser" class="col btn btn-light bi bi-eraser"></button>
                </div>
                <div class="row p-2 dropdown">
                    <button class="btn btn-light dropdown-toggle btn-sm" title="Size" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        ━━━━━━━━━
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">1 px</a></li>
                        <li><a class="dropdown-item" href="#">3 px</a></li>
                        <li><a class="dropdown-item" href="#">5 px</a></li>
                        <li><a class="dropdown-item" href="#">8 px</a></li>
                        <li><a class="dropdown-item" href="#">10 px</a></li>
                    </ul>
                </div>
                <div class="row px-2">
                    <input type="color" class="col form-control form-control-color" id="exampleColorInput"
                        value="#563d7c" title="Choose your color">
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
            <div class="col-9 board">
            </div>
        </div>
    </div>
</template>
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