var inc = 0.1;
var incStart = 0.005;
var magInc = 0.0005;
var start = 0;
var scl = 10;
var cols, rows;
var zoff = 0;
var fps;
var particles = [];
var numParticles = 500;
var flowfield;
var flowcolorfield;
var magOff = 0;
var showField = false;
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
let xoff = 0;
let yoff = 0;
let xIncrement = 0.01;
let yIncrement = 0.01;

const myForm = document.getElementById("countryForm")
 myForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const country = form.country_value.value;
          console.log(country);

  console.log(myForm.country_value.value)  

  fetch("http://api.weatherapi.com/v1/current.json?key=2aa2387eb5c648b5b6b232109232801&q=${Country}&aqi=no")
  .then(response => response.json())
  .then(data => {
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });


  // async function getWeatherData(city) {
  //   const API_KEY = 'http://api.weatherapi.com/v1/current.json?key=2aa2387eb5c648b5b6b232109232801&q=${India}&aqi=no';
  //   const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=2aa2387eb5c648b5b6b232109232801&q=${India}&aqi=no`);
  //   const data = await response.json();
  //   return data;
  // }
  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const city = document.getElementById('city').value;
  //   const weatherData = await getWeatherData(city);
  //   console.log(weatherData);
    
  // }
})


function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  cols = floor(width / scl);
  rows = floor(height / scl);
  background(0);

  for (let i = 0; i < numParticles; i++) {
    particles[i] = new Particle();
  }

  flowfield = new Array(rows * cols);
  flowcolorfield = new Array(rows * cols);
}

function Particle() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxSpeed = 2;

  this.prevPos = this.pos.copy();

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.show = function(colorfield) {
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
    //point(this.pos.x, this.pos.y);
  }

  this.inverseConstrain = function(pos, key, f, t) {
    if (pos[key] < f) {
      pos[key] = t;
      this.updatePrev();
    }
    if (pos[key] > t) {
      pos[key] = f;
      this.updatePrev();
    }
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function() {
    this.inverseConstrain(this.pos, 'x', 0, width);
    this.inverseConstrain(this.pos, 'y', 0, height);
  }

  this.follow = function(vectors, colorfield) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
    let c = colorfield[index];
    if (c) {
      stroke(color(c[0], c[1], c[2]));
    }
  }
}

function draw() {
  if (showField) {
    background(0);
  } else {
    background(color(0, 0, 0, 5));
  }
  var yoff = start;
  for (let y = 0; y < rows; y++) {
    let xoff = start;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let r = noise(xoff, yoff, zoff) * 255;
      let g = noise(xoff + 100, yoff + 100, zoff) * 255;
      let b = noise(xoff + 200, yoff + 200, zoff) * 255;
      let angle = noise(xoff, yoff, zoff) * TWO_PI;
      let v = p5.Vector.fromAngle(angle); // vector from angle
      let m = map(noise(xoff, yoff, magOff), 0, 1, -5, 5);
      v.setMag(m);
      if (showField) {
        push();
        stroke(255);
        translate(x * scl, y * scl);
        rotate(v.heading());
        let endpoint = abs(m) * scl;
        line(0, 0, endpoint, 0);
        if (m < 0) {
          stroke('red');
        } else {
          stroke('green');
        }
        line(endpoint - 2, 0, endpoint, 0);
        pop();
      }
      flowfield[index] = v;
      flowcolorfield[index] = [r, g, b];
      xoff += inc;
    }
    yoff += inc;
  }
  magOff += magInc;
  zoff += incStart;
  start -= magInc;

  if (!showField) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield, flowcolorfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }

    if (random(10) > 5 && particles.length < 2500) {
      let rnd = floor(noise(zoff) * 20);
      for (let i = 0; i < rnd; i++) {
        particles.push(new Particle());
      }
    } else if (particles.length > 2000) {
      let rnd = floor(random(10));
      for (let i = 0; i < rnd; i++) {
        particles.shift();
      }
    }
  }

  function mapTemperatureToColor(temp) {
    let normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);
  
    let r = map(normalizedTemp, 0, 1, 255, 0);
    let g = 0;
    let b = map(normalizedTemp, 0, 1, 0, 255);
  
    return color(r, g, b);
  }

  fill(mapTemperatureToColor(temperature));
  
}

