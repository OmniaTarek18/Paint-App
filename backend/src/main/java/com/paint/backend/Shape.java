package com.paint.backend;

abstract public class Shape {

    private String id;
    private double x;
    private double y;
    private String fill;
    private String stroke;
    private int strokeWidth;

    public Shape(String id, double x, double y, String fill, String stroke, int strokeWidth) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }

    public Shape(Shape target) {
        if (target != null) {
            this.id = target.id;
            this.x = target.x;
            this.y = target.y;
            this.fill = target.fill;
            this.stroke = target.stroke;
            this.strokeWidth = target.strokeWidth;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public String getFill() {
        return fill;
    }

    public void setFill(String fill) {
        this.fill = fill;
    }

    public String getStroke() {
        return stroke;
    }

    public void setStroke(String stroke) {
        this.stroke = stroke;
    }

    public int getStrokeWidth() {
        return strokeWidth;
    }

    public void setStrokeWidth(int strokeWidth) {
        this.strokeWidth = strokeWidth;
    }

    abstract public Shape clone();

    abstract public void update();

}
