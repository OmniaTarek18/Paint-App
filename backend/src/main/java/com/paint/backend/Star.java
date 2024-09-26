package com.paint.backend;

public class Star extends Shape {
    private double innerRadius;
    private double outerRadius;
    private int numPoints;

    public Star(String id, double x, double y, String fill, String stroke, int strokeWidth, double innerRadius,
            double outerRadius, int numPoints) {
        super(id, x, y, fill, stroke, strokeWidth);
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.numPoints = numPoints;
    }

    public Star(Star target) {
        super(target);
        if (target != null) {
            this.innerRadius = target.innerRadius;
            this.outerRadius = target.outerRadius;
            this.numPoints = target.numPoints;
        }
    }

    @Override
    public Shape clone() {
        return new Star(this);
    }

    @Override
    public void update() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

}
