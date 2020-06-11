var map; //this is the maptastic object
var configObject; //config object of maptastic, set at the beginning of the program

function mapCanvas(){
  configObject = {
    autoSave: false,
    autoLoad: true,
    labels: false, //prevents maptastic from displaying the id of the canvases
    layers: ['hydraCanvas'] //set the starting canvas
  };
  map = new Maptastic(configObject);
}

// this is the hydra instance
var sketch = new Hydra({
  // selects our canvas element in our DOM
  canvas: document.getElementById("hydraCanvas"),
  pb: null,
  autoLoop: true,
  makeGlobal: true,
  numSources: 4,
  numOutputs: 4,
  detectAudio: true,
});

// toggle on/off the side bar by pressing the ENTER key
$(document).keydown(function (e) {
  if (e.keyCode == 13) {
    // if the user presses the SPACEBAR:
    $("#toggle").toggle();
  }
});

// - - - - - ADD & DELETE CANVAS - - - - - -
//this variable enables to offset each new canvas from the previous one so that they don't appear on top of each other
var offsetcnv = 0
function addCanvas(){
  offsetcnv += 100;
  // reset the offset so that the canvas don't go out of the screen if a user add more than 6 canvases
  if(offsetcnv == 600){
    offsetcnv = 0;
  }
  var s = function(p) {
    p.setup = function() {
      var cnv = p.createCanvas(500,500);
      cnv.position(400 + offsetcnv, 0 + offsetcnv);
      map.addLayer(cnv.id())

    };
    p.draw = function() {
      p.image(sketch, 0, 0, 500,500);
    };
  };
  var myp5 = new p5(s);
}

function deleteCanvas(){
  //get all the canvas ids in an array
  var canvasArray = [];
  $('canvas').each(function(){
    var id = $(this).attr('id');
    canvasArray.push(id);
  });

  // clear the undefined values from the array
  canvasArray = canvasArray.filter(function( element ) {
    return element !== undefined;
  });

  if(canvasArray.length == 1){
    //prevent the original canvas to be deleted
    //if the hydraCanvas gets deleted it can't be copied anymore
    return
  }
  else if(canvasArray.length > 1){
  // delete the canvas and remove it from the array
  var lastCanvas = canvasArray[canvasArray.length - 1];
  document.getElementById(lastCanvas).remove();
  canvasArray.pop();

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // this command was not part of the original maptatsic library
  // it's a function I added inside the maptastic.js file
  // it deletes the mapping outline of the deleted canvas
  map.deleteLayer();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  }
}

// this make the canvas full screen
function flatScreenMode(){
  //delete the mapping layer before transforming the canvas
  map.deleteLayer();
  // reset the canvas transform
  $("#hydraCanvas").css("transform", "");
  $("#hydraCanvas").css( "width", "100%" );
  $("#hydraCanvas").css( "height", "100%" );
  // add a new mapping layer based on the new coordinates
  map.addLayer("hydraCanvas")
}
// reset the size of the original canvas if the user needs to
function resetSize(){
  map.deleteLayer();
  // reset the canvas transform
  $("#hydraCanvas").css("transform", "");
  $("#hydraCanvas").css("left", "35%");
  $("#hydraCanvas").css("top", "30%");
  $("#hydraCanvas").css( "width", "500px" );
  $("#hydraCanvas").css( "height", "500px" );
  // add a new mapping layer based on the new coordinates
  map.addLayer("hydraCanvas")
}
