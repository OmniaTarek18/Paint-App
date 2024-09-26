package com.paint.backend;

public class Ellipse extends Shape {
    private double radiusX;
    private double radiusY;
    public Ellipse(String id, double x, double y, String fill, String stroke, int strokeWidth, double radiusX,
            double radiusY) {
        super(id, x, y, fill, stroke, strokeWidth);
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }
    public Ellipse(Ellipse target) {
        super(target);
        if (target != null) {
            this.radiusX = target.radiusX;
            this.radiusY = target.radiusY;
        }
    }
    @Override
    public Shape clone() {
        return new Ellipse(this);
    }

    @Override
    public void update() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }
}
