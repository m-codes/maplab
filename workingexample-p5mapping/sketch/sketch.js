var dots = [];
let mic;
let miclvl;

function setup(){
  let canvas = createCanvas(windowWidth,windowHeight);
  canvas.parent('so-simple');
  for (var i = 0; i<800; i++) dots.push(new Dot());
  mic = new p5.AudioIn()
  mic.start();

}
function draw(){
  background(0);

  // console.log(miclvl);
for (var i = 0; i <dots.length; i++) dots[i].run();


}

function Dot () {

  this.velocity = createVector(0,0);
  this.loc = createVector(random(width),random(height));
  // this.acceleration = createVector(-0.001, 0.01);
  this.acceleration = createVector(sin(dots.length,cos(dots.length)));
  this.diam = 10;
  this.maxspeed = 200;

  // for (var i = 0 ; i< frameCount; i++)
  // {
  // this.maxspeed = i;
  // }

  this.run = function() {
    this.draw();
    this.move();
    this.borders();
  }

  this.draw = function() {
    fill(125);
    stroke(255)
    strokeWeight(2)
    ellipseMode(CENTER)
    miclvl = mic.getLevel();
    // ellipse(this.loc.x,this.loc.y,5,1)
    // point(this.loc.x,this.loc.y)
    ellipse(this.loc.x,this.loc.y, miclvl*100, miclvl*100);
  }

  this.move = function() {

  // var mouse = createVector(mouseX,mouseY);
  // rotate(frameCounts)
  var mouse = createVector(windowWidth/2,windowHeight/2);

  var dir = p5.Vector.sub(mouse,this.loc)
  dir.normalize();
  dir.mult(0.09);
  this.acceleration = dir;

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.loc.add(this.velocity)
  }

  this.borders = function () {
    if(this.loc.x<0){
      this.loc.x = width
    }
    else if (this.loc.x > width){
    this.loc.x = 0;
    }

    if(this.loc.y<0){
      this.loc.y = height;
    }
    else if (this.loc.y > height){
    this.loc.y = 0;
    }

  }
}
