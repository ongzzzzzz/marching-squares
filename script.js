// https://www.youtube.com/watch?v=6oMZb3yP_H8
// https://www.desmos.com/calculator/q08htskxrs

let res_x = 400, res_y = 200;
let u_x, u_y; // unit amounts

let balls = [
	{x: 200, y: 100, r:50},
	{x: 400, y: 200, r:50},
	{x: 600, y: 300, r:50},
	{x: 800, y: 400, r:50},
];

// example: f(x, y) = (x - x1)^2 + (y - y1)^2 = 20^2
// let X1=500, Y1=500, C=100*100;
// function f(x, y) {
// 	return ((x - X1)*(x - X1)) + ((y - Y1)*(y - Y1)); 
// }
let C = 1;
function f(x, y) {
	let sum = 0;
	for (let ball of balls) {
		sum += (ball.r) / (Math.sqrt( (x - ball.x)**2 + (y - ball.y)**2 ))
	}
	return sum;
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	// adjustable resolution
	u_x = width / res_x;
	u_y = height / res_y;

	// max res
	// u_x = 1;
	// u_y = 1;
	background(255);
}

// top left, top right, bottom left, bottom right
let tl, tr, br, bl; // values for each square

function draw() {
	stroke(0)
	for (let x = 0; x < width; x += u_x) {
		for (let y = 0; y < height; y += u_y) {
			tl = f(x		, y);
			tr = f(x + u_x	, y);
			br = f(x + u_x	, y + u_y);
			bl = f(x		, y + u_y);

			draw_line(x, y, tl, tr, br, bl);

			// if (frameCount % 1000 == 0) console.log(tl, tr, bl, br)
		}
	}
}

let corners, count, inner_corners;
// important for points in argument to be cyclic, so can easy if-evaluation in function
function draw_line(x1, y1, tl, tr, br, bl) {
	inner_corners = [];
	corners = Object.values(arguments).slice(2);

	corners.forEach((corner, i) => {
		if (corner < C) inner_corners.push(i);
	})

	count = inner_corners.length;

	// if (frameCount % 1000 == 0) console.log(inner_corners, count)

	// if none or all are inside contour, skip
	if (count == 0 || count == 4)
		return

	let x2 = x1 + u_x;
	let y2 = y1 + u_y;

	let top_lerp = lerp_point(x1, x2, tl, tr);
	let right_lerp = lerp_point(y1, y2, tr, br);
	let bottom_lerp = lerp_point(x1, x2, bl, br);
	let left_lerp = lerp_point(y1, y2, tl, bl);

	// if 1 point is inside contour
	if (count == 1) {
		if (inner_corners[0] == 0)
			line(x1, left_lerp, top_lerp, y1)
		if (inner_corners[0] == 1)
			line(top_lerp, y1, x2, right_lerp)
		if (inner_corners[0] == 2)
			line(bottom_lerp, y2, x2, right_lerp)
		if (inner_corners[0] == 3)
			line(x1, left_lerp, bottom_lerp, y2)
	}

	// if 2 same-side point inside contour
	if (count == 2) {
		// if same-side points in contour (found by index difference)
		if ([1, 3].includes(inner_corners[1] - inner_corners[0])) {
			// draw vertical or horizontal line
			if (inner_corners[0] + inner_corners[1] == 3) {
				// draw vertical
				line(top_lerp, y1, top_lerp, y2)
			}
			else {
				// draw horizontal
				line(x1, left_lerp, x2, left_lerp)
			}
		}
		// if opp-side points in countour
		else {
			// calc inner point
			let middle = f(x1 + (0.5 * u_x), y1 + (0.5 * u_y));
			if (middle < C) {
				// if middle in contour
				if (inner_corners[0] == 0) {
					line(top_lerp, y1, x2, right_lerp)
					line(x1, left_lerp, bottom_lerp, y2)
				}
				else {
					line(x1, left_lerp, top_lerp, y1)
					line(bottom_lerp, y2, x2, right_lerp)
				}
			}
			else {
				// if middle not in contour
				if (inner_corners[0] == 0) {
					line(x1, left_lerp, top_lerp, y1)
					line(bottom_lerp, y2, x2, right_lerp)
				}
				else {
					line(top_lerp, y1, x2, right_lerp)
					line(x1, left_lerp, bottom_lerp, y2)
				}
			}
		}
	}

	// if 3 points in contour
	if (count == 3) {
		if (!inner_corners.includes(0))
			line(x1, left_lerp, top_lerp, y1)
		if (!inner_corners.includes(1))
			line(top_lerp, y1, x2, right_lerp)
		if (!inner_corners.includes(2))
			line(bottom_lerp, y2, x2, right_lerp)
		if (!inner_corners.includes(3))
			line(x1, left_lerp, bottom_lerp, y2)
	}
}



function lerp_point(c1, c2, v1, v2) {
	// c = coordinates, v = values
	let gradient = (v2 - v1) / (c2 - c1);
	return c1 + ((C - v1) / gradient)
}