var inc = 0.1;
var incStart = 0.005;
var magInc = 0.0005;
var start = 0;
var scl = 10;
var cols, rows;
var zoff = 0;
var fps;
var particles = [];
var numParticles = 0;
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
let maxTemp = 100;
let country = '';
let xoff = 0;
let yoff = 0;
let xIncrement = 0.01;
let yIncrement = 0.01;


window.onload = function() {
  const countryForm = document.getElementById("countryForm");

  countryForm.addEventListener('submit', function(event){
    event.preventDefault(); 

    const country = countryForm.country_value.value;
    const api_url = "http://api.weatherapi.com/v1/current.json?key=2aa2387eb5c648b5b6b232109232801&q="

    let final_query = api_url + country

    console.log(final_query);
    

    fetch(final_query)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(data => {
      console.log(data);
        temperature = data.current.temp_c;
        numParticles = temperature
        let tempFactor = map(numParticles, 0, 40, 0.1, 2);

        for (let i = 0; i < Math.abs(numParticles); i++) {
          particles[i].maxSpeed = tempFactor;
        }

        document.getElementById("temperature").innerHTML = `Temperature: ${temperature}°C`
        document.getElementById("country").innerHTML = `Place: ${countryForm}`
    })
    
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  
})
}

function mapTemperatureToColor(temp) {
  let normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);

  let r = map(normalizedTemp, 0, 1, 255, 0);
  let g = 0;
  let b = map(normalizedTemp, 0, 1, 0, 255);

  stroke(mapTemperatureToColor(temp))

  console.log(mapTemperatureToColor(temp))

  return color(r, g, b);

}

function flowField() {
  let xoff = 0;
  for (let x = 0; x < width; x += res) {
    let yoff = 0;
    for (let y = 0; y < height; y += res) {
      let index = (x + y * width) * 4;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);

      
      let temp = temperatureData[index / 4];
      let normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);
      v.setMag(speed * (1 - normalizedTemp));

      flowfield[index / 4] = v;
      yoff += inc;
    }
    xoff += inc;
  }
  zoff += 0.0003;
}

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
        this.acc.mult(1 + temperature);
      }

      this.show = function(colorfield) {
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.updatePrev();
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
    temperature += 0.01;
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
          let v = p5.Vector.fromAngle(angle); 
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
     
    }



