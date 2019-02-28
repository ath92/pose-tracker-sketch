let poseDetector;

function setup() {
	createCanvas(windowWidth, windowHeight);
	poseDetector = PoseDetector(windowWidth);
	poseDetector.startTracking();
}

function draw() {
	clear();
	fill(255, 255, 255);

	const keypoints = poseDetector.getKeypoints();
	keypoints.forEach(({ position }) => {
		circle(position.x, position.y, 20);
	});
}
let isFullscreen = false;
function keyPressed() {
	if (keyCode === 70) { // 'f'
		isFullscreen = !isFullscreen;
		fullscreen(isFullscreen);
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}