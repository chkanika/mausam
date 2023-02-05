let angle = 0;
let offset = 0;
let bgColor = 0;
let noiseSeed = 0;
let branchRatio;
let time = 0;
let temperature = 0;
let minTemp = 0;
let maxTemp = 300;
let country = '';


function mapTemperatureToColor(temp) {
    let normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);
  
    let r = map(normalizedTemp, 0, 1, 255, 0);
    let g = 0;
    let b = map(normalizedTemp, 0, 1, 0, 255);
  
    return color(r, g, b);
  }


function setup() {
  createCanvas(windowWidth, windowHeight);
  angle = radians(30);
  branchRatio = 0.67;

 
  fetch('http://api.weatherapi.com/v1/current.json?key=2aa2387eb5c648b5b6b232109232801&q=[India]&aqi=no')
    .then(response => response.json())
    .then(data => {
      temperature = data.main.temp;
    });

    fill(mapTemperatureToColor(temperature));

}

function draw() {
  background(bgColor);
  translate(width / 2, height / 2);
  stroke(255);

  
  fill(mapTemperatureToColor(temperature));
  if (temperature >= 300) {
    for (let i = 0; i < 4; i++) {
      push();
      let x = 100 * sin(time + i * 0.3) * sin(time);
      let y = 100 * cos(time + i * 0.3) * cos(time);
      translate(x, y);
      rotate(i * TWO_PI / 4);
      drawBranch(100 * sin(time * 0.3) + temperature / 100);
      pop();
    }
  } else if (temperature >= 280) {
    for (let i = 0; i < 4; i++) {
      push();
      let x = 100 * sin(time + i * 0.2) * sin(time);
      let y = 100 * cos(time + i * 0.2) * cos(time);
      translate(x, y);
      rotate(i * TWO_PI / 4);
      drawBranch(100 * sin(time * 0.2) + temperature / 100);
      pop();
    }
  } else {
    for (let i = 0; i < 4; i++) {
      push();
      let x = 100 * sin(time + i * 0.1) * sin(time);
      let y = 100 * cos(time + i * 0.1) * cos(time);
      translate(x, y);
      rotate(i * TWO_PI / 4);
      drawBranch(100 * sin(time * 0.1) + temperature / 100);
      pop();
    }
  }


  time += 0.05;
}

function drawBranch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > 4) {
    push();
    rotate(angle * sin(time * 0.1) + temperature / 100);
    drawBranch(len * branchRatio);
    pop();
    push();
    rotate(-angle * sin(time * 0.1) - temperature / 100);
    drawBranch(len * branchRatio);
    pop();
  }

 resetMatrix()

 function drawFern(x, y, size) {
    // Draw the fern fractal using recursion
    if (size > 2) {
      push();
      translate(x, y);
      scale(size / 100);
  
      // Draw the main stem of the fern
      stroke(0);
      line(0, 0, 0, -size);
      translate(0, -size);
  
      // Draw the first branch of the fern
      drawFern(-size / 2, -size / 2, size / 2);
  
      // Draw the second branch of the fern
      drawFern(size / 2, -size / 2, size / 2);
  
      // Draw the fronds of the fern
      fill(mapTemperatureToColor(temperature));
      noStroke();
      ellipse(0, 0, size / 2, size / 2);
      pop();
    }
  }

  translate(width / 2, height / 2);
  rotate(angle + mouseX/200);
  translate(offset + mouseY/200, 0);

  angle += 0.01;
  offset += 0.1;
 

  setInterval(() => {
    bgColor = color(random(255), random(255), random(255));
  }, 3000 * 1000);
}







