class Fraction {
    constructor(numerator, denominator) {
        // Check if we can round it
        if (numerator % denominator === 0) {
            this.numerator = numerator / denominator;
            this.denominator = 1;
        } else {

            this.numerator = numerator;
            this.denominator = denominator;
        }
    }

    add(fraction) {
        if (this.denominator == 0 && this.denominator == 0) {
            return fraction;
        }
        if (this.denominator === fraction.denominator) {
            return new Fraction(this.numerator + fraction.numerator, this.denominator);
        } else {
            return new Fraction(this.numerator * fraction.denominator + fraction.numerator * this.denominator, this.denominator * fraction.denominator);
        }
    }

    sub(fraction) {
        if (this.denominator == 0 && this.denominator == 0) {
            return new Fraction(-fraction.numerator, fraction.denominator);
        }
        if (this.denominator === fraction.denominator) {
            return new Fraction(this.numerator - fraction.numerator, this.denominator);
        } else {
            return new Fraction(this.numerator * fraction.denominator - fraction.numerator * this.denominator, this.denominator * fraction.denominator);
        }
    }

    mul(fraction) {
        return new Fraction(this.numerator * fraction.numerator, this.denominator * fraction.denominator);
    }

    div(fraction) {
        return new Fraction(this.numerator * fraction.denominator, this.denominator * fraction.numerator);
    }

    toString() {
        return `${this.numerator}/${this.denominator}`;
    }

    toFloat() {
        if (this.denominator === 0) {
            return 0;
        }
        return this.numerator / this.denominator;
    }

}