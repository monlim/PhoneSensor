function handleOrientation(event) {
  updateFieldIfNotNull("Orientation_a", event.alpha);
  updateFieldIfNotNull("Orientation_b", event.beta);
  updateFieldIfNotNull("Orientation_g", event.gamma);
  if (event.beta < 10) pitchShift.pitch = 0;
  if (10 <= event.beta && event.beta < 30) pitchShift.pitch = 4;
  if (30 <= event.beta && event.beta < 60) pitchShift.pitch = 7;
  if (60 <= event.beta && event.beta < 100) pitchShift.pitch = 12;
  if (event.beta >= 100) pitchShift.pitch = 16;

  incrementEventCount();
}

function incrementEventCount() {
  let counterElement = document.getElementById("num-observed-events");
  let eventCount = parseInt(counterElement.innerHTML);
  counterElement.innerHTML = eventCount + 1;
}

function updateFieldIfNotNull(fieldName, value, precision = 10) {
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(precision);
}

let accel;
function handleMotion(event) {
  updateFieldIfNotNull(
    "Accelerometer_gx",
    event.accelerationIncludingGravity.x
  );
  updateFieldIfNotNull(
    "Accelerometer_gy",
    event.accelerationIncludingGravity.y
  );
  updateFieldIfNotNull(
    "Accelerometer_gz",
    event.accelerationIncludingGravity.z
  );
  updateFieldIfNotNull("Accelerometer_x", event.acceleration.x);
  updateFieldIfNotNull("Accelerometer_y", event.acceleration.y);
  updateFieldIfNotNull("Accelerometer_z", event.acceleration.z);

  accel =
    event.acceleration.x ** 2 +
    event.acceleration.y ** 2 +
    event.acceleration.z ** 2;
  updateFieldIfNotNull("All", accel);

  updateFieldIfNotNull("Accelerometer_i", event.interval, 2);
  updateFieldIfNotNull("Gyroscope_z", event.rotationRate.alpha);
  updateFieldIfNotNull("Gyroscope_x", event.rotationRate.beta);
  updateFieldIfNotNull("Gyroscope_y", event.rotationRate.gamma);
  incrementEventCount();
}

let is_running = false;
let demo_button = document.getElementById("start_demo");
demo_button.onclick = function (e) {
  e.preventDefault();

  // Request permission for iOS 13+ devices
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }

  if (is_running) {
    window.removeEventListener("devicemotion", handleMotion);
    window.removeEventListener("deviceorientation", handleOrientation);
    window.removeEventListener("shake", shakeEventDidOccur, false);
    demo_button.innerHTML = "START";
    document.getElementById("circle").style.background = "green";
    is_running = false;
  } else {
    window.addEventListener("devicemotion", handleMotion);
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("shake", shakeEventDidOccur, false);
    document.getElementById("start_demo").innerHTML = "STOP";
    document.getElementById("circle").style.background = "red";
    is_running = true;
  }
};

var myShakeEvent = new Shake({
  threshold: 10, // optional shake strength threshold
  timeout: 1000, // optional, determines the frequency of event generation
});

//function to call when shake occurs
function shakeEventDidOccur() {
  shakeDict[Math.floor(Math.random() * 27)].start();
  //alert('shake!');
}
