package com.paint.backend;

public class RegularPolygon extends Shape {
    private double radius;
    private int sides;
    public RegularPolygon(String id, double x, double y, String fill, String stroke, int strokeWidth, double radius,
            int sides) {
        super(id, x, y, fill, stroke, strokeWidth);
        this.radius = radius;
        this.sides = sides;
    }
    public RegularPolygon(RegularPolygon target) {
        super(target);
        if (target != null) {
            this.radius = target.radius;
            this.sides = target.sides;
        }
    }
    @Override
    public Shape clone() {
        return new RegularPolygon(this);
    }

    @Override
    public void update() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }
}
