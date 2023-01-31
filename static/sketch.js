function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}



function setup() {
	createCanvas(400, 200);
	background(220);
  ellipse(width/2, height/2, 100);
  
  

//	var p = createP('gaanu (✿◠‿◠)');


  
//	p.style('color', 'white');
//	p.style('font-size', '50px');
//	p.style('font-family', 'timesnewroman');
//  p.style('text-align', 'left')
//	p.style('background-color', 'powerblue');
//	p.style('padding', '1em');
//	p.style('width', '50%');

}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // Add other p5.js code here
}


var temp;

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadJSON("http://api.weatherapi.com/v1/current.json?key=2aa2387eb5c648b5b6b232109232801&q=${countries[i]}&aqi=no", gotData);
  fill('#fae');
}

function gotData(data) {
  temp = data.main.temp;
}

function draw() {
  background(220);
  for (var i = 0; i < 50; i++) {
    fill(temp, random(255), random(255));
    ellipse(random(width), random(height), random(width / 10, width / 5), random(height / 10, height / 5));
}

function draw() {
  background(220);
  for (var i = 0; i < temp / 10; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), temp / 5, temp / 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

  fill('#fae');
  fill(color("#rgb"));
  fill('#222222');
  colorMode(HSB);
  fill(51);
  

}
