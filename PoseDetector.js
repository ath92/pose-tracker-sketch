// Pose detector based on tensorFlow/posenet
// expects tensorflowjs and posenet to be included through script tags
// (i.e. posenet is defined in global scope)

function PoseDetector(
	videoWidth = 800,
	minConfidence = 0
) {
	const videoHeight = Math.round(videoWidth * 9 / 16);

	let keypoints = [];

	async function setupCamera() {
	  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
	    throw new Error(
	        'Browser API navigator.mediaDevices.getUserMedia not available');
	  }

	  const video = document.getElementById('video');
	  video.width = videoWidth;
	  video.height = videoHeight;

	  const stream = await navigator.mediaDevices.getUserMedia({
	    'audio': false,
	    'video': {
	      facingMode: 'user',
	      width: videoWidth,
	      height: videoHeight,
	    },
	  });
	  video.srcObject = stream;

	  return new Promise((resolve) => {
	    video.onloadedmetadata = () => {
	      resolve(video);
	    };
	  });
	}

	async function loadVideo() {
	  const video = await setupCamera();
	  video.play();

	  return video;
	}

	async function track(video, net) {
	  const imageScaleFactor = 0.2;
	  const flipHorizontal = false;
	  const outputStride = 16;
	  const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
	  
	  keypoints = pose.keypoints.filter(({ score }) => score > minConfidence);

  	  requestAnimationFrame(() => track(video, net));
	}

	async function startTracking(){
	  const video = await loadVideo();
	  const net = await posenet.load(0.75);

  	  requestAnimationFrame(() => track(video, net));
	}

	function getKeypoints() {
		return keypoints;
	}

	return { startTracking, getKeypoints };
}
