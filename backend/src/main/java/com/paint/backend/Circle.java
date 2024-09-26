package com.paint.backend;

public class Circle extends Shape {
    private double radius;

    public Circle(String id, double x, double y, String fill, String stroke, int strokeWidth, double radius) {
        super(id, x, y, fill, stroke, strokeWidth);
        this.radius = radius;
    }

    public Circle(Circle target) {
        super(target);
        if (target != null) {
            this.radius = target.radius;
        }
    }

    @Override
    public Shape clone() {
        return new Circle(this);
    }

    @Override
    public void update() {
        // TODO Auto-generated method stub
    }

}
