const inc = 0.1, timeScale = 0.0001;
var scl = 20;
var cols, rows;
var yoff = 0, xoff = 0, zoff = 0;
var particles = [], particleNum = 1000, spdFact = 0.99, maxSpeed = 10;
var forces = [];

function setup() {
	var cnv = createCanvas(windowHeight, windowHeight);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
	cols = floor(windowWidth/scl);
	rows = floor(windowHeight/scl);

	for (var i = 0; i < particleNum; i++) {
		particles.push(new Particle(createVector(scl*int(width/scl), random(0, scl*int(width/scl))), p5.Vector.random2D()))
	}

	background(255);
}

function draw() {
	// background(255);

	yoff = 0;
	for (var y = 0; y < rows; y++) {
		xoff = 0;
		var temp = [];
		for (var x = 0; x < cols; x++) {
			var index = (x + y * width) * scl;
			var phi = noise(xoff, yoff, zoff) * TWO_PI;

			temp.push(p5.Vector.fromAngle(phi));

			xoff += inc;

			fill(255);
			noStroke();
			// rect(x * scl, y * scl, x * scl + scl, y * scl + scl);

			// stroke(0);
			// strokeWeight(1);
			// var v = p5.Vector.fromAngle(phi);
			// push();
			// translate(x * scl, y * scl);
			// rotate(v.heading());
			// line(0, 0, scl, 0);
			// pop();
		}
		forces.push(temp);

		yoff += inc;
	}

	zoff += timeScale;

	for (var p of particles) {
		var force = forces[floor(p.pos.y/scl)][floor(p.pos.x/scl)];
		force.mult(spdFact);
		p.applyForce(force);
		p.update();
		p.show();
	}
}

function Particle(pos, vel) {
	this.pos = pos;
	this.prev = this.pos.copy();
	this.vel = vel;

	this.inHeart = function() {
		tempPos = p5.Vector.sub(this.pos, createVector(width/2, height/2));
		angle = tempPos.heading() - PI;
		// x = 16 * pow(sin(angle), 3);
		// y = 13 * cos(angle);// - 5 * cos(2*angle) - 2 * cos(3 * angle) - cos(4 * angle);
		// x = cos(angle);
		// y = sin(angle);
		// x *= 10;
		// y *= 10;
		// d = x * x + y * y;

		// r = 1 - sin(angle + PI/2);
		r = 2 - 2*sin(angle) + (sin(angle)*sqrt(abs(cos(angle))))/(sin(angle) + 1.4)
		d = 5000*r;

		if (tempPos.x * tempPos.x + tempPos.y * tempPos.y < d) {
			return true;
		} else
			return false;
	}

	this.update = function() {
		this.prev = this.pos.copy();

		this.vel.limit(maxSpeed);
		this.pos.add(this.vel);

		if (this.pos.x < 0) {
			this.pos.x += width;
			this.prev = this.pos.copy();
		} else if (this.pos.x > width) {
			this.pos.x -= width;
			this.prev = this.pos.copy();
		}
		if (this.pos.y < 0) {
			this.pos.y += height;
			this.prev = this.pos.copy();
		} else if (this.pos.y > height) {
			this.pos.y -= height;
			this.prev = this.pos.copy();
		}
	}

	this.show = function() {
		strokeWeight(1);
		if (this.inHeart()) {
			stroke(255, 0, 0, 8);
		} else {
			stroke(219,112,147, 3);
		}
		line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
	}

	this.applyForce = function(acc) {
		this.vel.add(acc);
	}
}
