const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const BOX_SIZE = 100;

let observer = {
	x: width / 2 + BOX_SIZE / 2,
	y: height / 2 + BOX_SIZE / 2,
	z: -10,
};

const viewport = {
	A: 0,
	B: 0,
	C: 1,
	D: 0,
};

const calculateLine = (p1, p2) => {
	let x = {
		a: p2.x - p1.x,
		b: p1.x,
	};

	let y = {
		a: p2.y - p1.y,
		b: p1.y,
	};

	let z = {
		a: p2.z - p1.z,
		b: p1.z,
	};

	return { x, y, z };
};

const calculateIntersection = (line, viewport) => {
	let t = -(viewport.D + viewport.A * line.x.b + viewport.B * line.y.b + viewport.C * line.z.b) / (viewport.A * line.x.a + viewport.B * line.y.a + viewport.C * line.z.a);

	return {
		x: line.x.a * t + line.x.b,
		y: line.y.a * t + line.y.b,
		z: line.z.a * t + line.z.b,
	};
};

class Line {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	render(observer, viewport) {
		const line1 = calculateLine(observer, this.p1);
		const intersection1 = calculateIntersection(line1, viewport);
		
		const line2 = calculateLine(observer, this.p2);
		const intersection2 = calculateIntersection(line2, viewport);

		return { intersection1, intersection2 };
	}
}

const drawLine = (line) => {
	ctx.beginPath();

	const render = line.render(observer, viewport);

	ctx.moveTo(render.intersection1.x, render.intersection1.y);
	ctx.lineTo(render.intersection2.x, render.intersection2.y);
	ctx.stroke();
}

class Box {
	constructor(p1, p2, p3, p4, p5, p6, p7, p8) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.p4 = p4;
		this.p5 = p5;
		this.p6 = p6;
		this.p7 = p7;
		this.p8 = p8;
	}

	render(observer, viewport) {
		const line1 = new Line(this.p1, this.p2);
		const line2 = new Line(this.p2, this.p3);
		const line3 = new Line(this.p3, this.p4);
		const line4 = new Line(this.p4, this.p1);

		const line5 = new Line(this.p5, this.p6);
		const line6 = new Line(this.p6, this.p7);
		const line7 = new Line(this.p7, this.p8);
		const line8 = new Line(this.p8, this.p5);

		const line9 = new Line(this.p1, this.p5);
		const line10 = new Line(this.p2, this.p6);
		const line11 = new Line(this.p3, this.p7);
		const line12 = new Line(this.p4, this.p8);

		const lines = [line1, line2, line3, line4, line5, line6, line7, line8, line9, line10, line11, line12];

		return lines.map((line) => line.render(observer, viewport));
	}
}

const box = new Box(
	{ x: 1000, y: 1000, z: 100 },
	{ x: 2000, y: 1000, z: 100 },
	{ x: 2000, y: 2000, z: 100 },
	{ x: 1000, y: 2000, z: 100 },
	{ x: 1000, y: 1000, z: 200 },
	{ x: 2000, y: 1000, z: 200 },
	{ x: 2000, y: 2000, z: 200 },
	{ x: 1000, y: 2000, z: 200 },
);


const drawBox = (cube) => {
	const render = cube.render(observer, viewport);

	render.forEach((line) => {
		ctx.beginPath();

		ctx.moveTo(line.intersection1.x, line.intersection1.y);
		ctx.lineTo(line.intersection2.x, line.intersection2.y);
		ctx.stroke();
	});
}

class Cube {
	constructor(center, size) {
		this.center = center;
		this.size = size;
	}

	render(observer, viewport) {
		const halfSize = this.size / 2;

		const p1 = {
			x: this.center.x - halfSize,
			y: this.center.y - halfSize,
			z: this.center.z - halfSize,
		};

		const p2 = {
			x: this.center.x + halfSize,
			y: this.center.y - halfSize,
			z: this.center.z - halfSize,
		};

		const p3 = {
			x: this.center.x + halfSize,
			y: this.center.y + halfSize,
			z: this.center.z - halfSize,
		};

		const p4 = {
			x: this.center.x - halfSize,
			y: this.center.y + halfSize,
			z: this.center.z - halfSize,
		};

		const p5 = {
			x: this.center.x - halfSize,
			y: this.center.y - halfSize,
			z: this.center.z + halfSize,
		};

		const p6 = {
			x: this.center.x + halfSize,
			y: this.center.y - halfSize,
			z: this.center.z + halfSize,
		};

		const p7 = {
			x: this.center.x + halfSize,
			y: this.center.y + halfSize,
			z: this.center.z + halfSize,
		};

		const p8 = {
			x: this.center.x - halfSize,
			y: this.center.y + halfSize,
			z: this.center.z + halfSize,
		};

		const box = new Box(p1, p2, p3, p4, p5, p6, p7, p8);

		return box.render(observer, viewport);
	}
}

const cube = new Cube({ x: 0, y: 0, z: 100 }, BOX_SIZE);

const draw = () => {
	ctx.clearRect(0, 0, width, height);

	ctx.fillStyle = '#fff';
	ctx.strokeStyle = '#fff';

	drawBox(cube);
}

draw();