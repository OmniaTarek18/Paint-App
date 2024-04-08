<template>
  <div id="background">
    <div id="board">
    </div>
    <!-- <div class="tool">
          <div class="shapes">
              <div class="tool-text">Shapes</div>
              <Button id="line" @click="choseShape('line')" class="bi bi-slash-lg" text rounded></Button>
              <Button id="square" @click="choseShape('square')" class="bi bi-square" text rounded></Button>
              <Button id="circle" @click="choseShape('circle')" class="bi bi-circle" text rounded></Button>
              <Button id="ellipse" @click="choseShape('ellipse')" text rounded> &#11053; </Button>
              <Button id="rectangle" @click="choseShape('rectangle')" text rounded>&#9645;</Button>
              <Button id="triangle" @click="choseShape('triangle')" class="bi bi-triangle" text rounded></Button>
              <Button id="diamond" @click="choseShape('diamond')" class="bi bi-suit-diamond" text rounded></Button>
              <Button id="pentagon" @click="choseShape('pentagon')" class="bi bi-pentagon" text rounded></Button>
              <Button id="star" @click="draw()" class="bi bi-star" text rounded></Button>
          </div>
          <hr>
          <div class="draw">
              <div class="tool-text">Tools</div>
              <Button class="bi bi-pencil" text rounded></Button>
              <Button class="bi bi-eraser" text rounded></Button>
              <div class="draw">
                  <Button class="bi bi-copy" text rounded></Button>
                  <Button class="bi bi-x-lg" text rounded></Button>
              </div>
          </div>
          <hr>
       
          <hr>
          <div class="undo-redo">
              <div class="tool-text">Options</div>
              <button class="bi bi-arrow-counterclockwise" text rounded></button>
              <button class="bi bi-arrow-clockwise" text rounded></button>
          </div>
          <hr>
        </div>-->
    <div class="colors">
      <input type="color" class="form-control form-control-color" v-model="shapeColor" title="Choose your color">
      <input type="color" class="form-control form-control-color" v-model="strokeColor" title="Choose your color">
    </div>
    <div class="load-store">
      <button class="bi bi-download"></button>
      <button class="bi bi-upload"></button>
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
      stageSize: {},
      shapeType: '',
      shapes: [], // each shape has id and configShape
      id: 0,
      strokeWidth: 2,
      brushWidth: 5,
      shapeColor: "#563d7c",
      strokeColor: "#000000",
      isDrawing: false, // when one of the buttons of shapes is selected
      isColoring: false, // when fill color button is selected // toggle it when we draw
      isStrokeChange: false, // toggle it when we draw
    }
  },
  methods: {
    startDrawing() {
      this.isDrawing = true;
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    // each shape can be removed easily using destory or remove then splice it from the array
    intializeCircle(pos) {
      return new Konva.Circle({
        x: pos.x,
        y: pos.y,
        fill: 'red',
        draggable: true,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
    },
    intializeRect(pos) {
      return new Konva.Rect({
        x: pos.x,
        y: pos.y,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
        id: `${this.id}`,
        draggable: true,
      });
    },
    intializeLine(pos) {

    },
    intializePoints(pos) {

    },
    intializeElipse(pos) {
      return new Konva.Ellipse({
        x: pos.x,
        y: pos.y,
        draggable: true,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
    },
    intializeTriangle(pos) {
      return new Konva.RegularPolygon({
        x: pos.x,
        y: pos.y,
        sides: 3,
        draggable: true,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
    },
    intializeStar(pos) {
      return new Konva.Star({
        x: pos.x,
        y: pos.y,
        numPoints: 5,
        draggable: true,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
    },
    intializeSquare(pos) {
      return new Konva.Rect({
        x: pos.x,
        y: pos.y,
        id: `${this.id}`,
        draggable: true,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
    },
    intializePentagon(pos) {
      return new Konva.RegularPolygon({
        x: pos.x,
        y: pos.y,
        sides: 5,
        draggable: true,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
    },
    intializeHexagon(pos) {
      return new Konva.RegularPolygon({
        x: pos.x,
        y: pos.y,
        sides: 6,
        draggable: true,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
    },
    // intialize shape creation
    intializeShape(shapeType) {
      if (!this.isDrawing)
        return;
      let configShape;
      switch (shapeType) {
        case "square":
          configShape = this.intializeSquare();
          break;
        case "rect":
          configShape = this.intializeRect();
          break;
        case "circle":
          configShape = this.intializeCircle();
          break;

        case "triangle":
          configShape = this.intializeTriangle();
          break;

        case "star":
          configShape = this.intializeStar();
          break;

        case "pentagon":
          configShape = this.intializePentagon();
          break;

        case "elipse":
          configShape = this.intializeElipse();
          break;

        case "line":
          configShape = this.intializeLine();
          break;
      }
      configShape.on('mousedown', this.handleChange(configShape));
      this.shapes.push(configShape);
      this.layer.add(configShape);
      this.id++;
    },
    drawCircle() {

    },
    drawRect(shape) {
      return rect = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
        id: `${this.id}`,
        draggable: true,
      });
    },
    drawLine(shape) {

    },
    drawPoints(shape) {

    },
    drawElipse(shape) {

    },
    drawTriangle(shape) {

    },
    drawStar(shape) {

    },
    drawSquare(shape) {
      return rect = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        fill: this.shapeColor,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
        id: `${this.id}`,
        draggable: true,
      });
    },
    drawPentagon(shape) {

    },
    drawHexagon(shape) {

    },
    // modify the last shape in the list until mouse is up
    drawShape(shapeType) {
      if (!this.isDrawing)
        return;
      let configShape = this.shapes[this.shapes.length - 1];
      switch (shapeType) {
        case "square":
          this.drawSquare(configShape);
          break;
        case "rect":
          this.drawRect(configShape);
          break;
        case "circle":
          this.drawCircle(configShape);
          break;

        case "triangle":
          this.drawTriangle(configShape);
          break;

        case "star":
          this.drawStar(configShape);
          break;

        case "pentagon":
          this.drawPentagon(configShape);
          break;

        case "elipse":
          this.drawElipse(configShape);
          break;

        case "line":
          this.drawLine(configShape);
          break;
      }
    },
    
    // handle change color after creation
    handleChange(shape) {
      if (!this.isColoring && !this.isStrokeChange)
        return;
      if (this.isColoring) shape.fill(this.shapeColor);
      if (this.isStrokeChange) {
        shape.strokeWidth(this.strokeWidth);
        shape.stroke(this.strokeColor);
      }
    },
  
    load() {
      const data = localStorage.getItem('storage');
      if (data) this.shapes = JSON.parse(data);
    },

    save() {
      localStorage.setItem('storage', JSON.stringify(this.shapes));
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
    
    // handle intialize the shapes
    this.stage.on('mousedown', this.intializeShape);
    // handle creation
    this.stage.on('mousemove', this.drawShape);

    this.stage.on('mouseup', this.stopDrawing);
    // handle transformation

  },

}

</script>

<style>
body {
  background-color: #4A98F7;
}

#background {
  display: flex;
  width: 75%;
  height: 550px;
  margin: auto;
}

#board {
  width: 75%;
  margin-right: 25px;
}

.tool {
  width: 20%;
}

#board,
.tool {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.264);
}

.tool,
#board {
  background-color: white;
  border-radius: 5px;
}

.shapes Button,
.draw Button {
  margin-top: 5px;
  margin-left: 5px;
  width: calc ((100% - 20px) / 3);
}

.tool-text {
  margin-top: 15px;
  font-size: small;
}

.shapes {
  margin-left: -5px;
}

.load-store Button,
.undo-redo Button {
  border: none;
  cursor: pointer;
  font-size: x-large;
  color: #4a98f7;
  width: ((100% -25px)/2);
  background-color: white;
  margin: 5px 5px;
  border-radius: 10px;
  padding: 0 15px;
}

button:hover {
  background-color: #f1f0f09b;
}

#rectangle,
#ellipse {
  color: #4A98F7;
  font-size: 22px;
}

hr {
  width: 75%;
  border: #cfcece70 0.05px solid;
  stroke: none;
  border-radius: 30px;
}

.load-store {
  margin-top: 25px;
}

#color-picker {
  margin: 5px 0;
}

#color-picker input {
  padding: 0 50px;
}

.colors #bucket {
  margin-right: 15px;
}

.colors #bucket :hover {
  margin-right: 15px;
  border: #ffffff 2px solid;
}
</style>
