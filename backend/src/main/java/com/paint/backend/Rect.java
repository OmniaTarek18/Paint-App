package com.paint.backend;

public class Rect extends Shape {
    private double width;
    private double height;

    public Rect(String id, double x, double y, String fill, String stroke, int strokeWidth, double width,
            double height) {
        super(id, x, y, fill, stroke, strokeWidth);
        this.width = width;
        this.height = height;
    }

    public Rect(Rect target) {
        super(target);
        if (target != null) {
            this.width = target.width;
            this.height = target.height;
        }
    }

    @Override
    public Shape clone() {
        return new Rect(this);
    }

    @Override
    public void update() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }
}
