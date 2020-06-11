// - - - - - PATTERNS - - - - - -
function Patterns() {
  this.binValue = 4;
  this.smooth = 0.98;
  this.minVolume = 7;
  this.maxVolume = 10;

  hush(); //hush is a command to clear the rgb buffers in hydra
  a.setBins(this.binValue);
  a.setSmooth(this.smooth);
  a.setCutoff(this.minVolume);
  a.setScale(this.maxVolume);

  // this is how flickery the result is, smoother is better in most cases
  $("#smoothSlider").on("change", function () {
    this.smooth = $(this).val();
    a.setSmooth(this.smooth);
  });
  // minVolume and maxVolume together create a range within which the signal is analysed
  // this sets a minimum volume input/the quietest the user is going to play
  $("#minSlider").on("change", function () {
    this.minVolume = $(this).val();
    a.setCutoff(this.minVolume);
  });
  // this sets a maximum volume input/the loudest the user is going to play
  $("#maxSlider").on("change", function () {
    this.maxVolume = $(this).val();
    a.setScale(this.maxVolume);
  });

  // turn on the spectrum analyser by default
  a.show();
  // although a is an object it has no id or name when displayed as a canvas in the HTML
  // It's grab by looking for its default width and height
  // then its css properties are changed so it can be read easily by the user
  // by default a.show() is a small spectrum analyser but below it is modified thanks to jquery
  var spectrum = $('canvas[width="100"][height="80"]').css({
    "width": "300px",
    "height": "300px",
    "padding": "0",
    "margin": "auto",
    "display": "block",
    "position": "absolute",
    "top": "60%",
    "bottom": "0",
    "left": "80%",
    "right": "0px",
    "background-color": "gray"
  })

  // this function toggle on and of the spectrum analyser
  $(document).ready(function(){
    $('input[type="checkbox"]').click(function(){
      if($(this).prop("checked") == true){
        a.show();
      }
      else if($(this).prop("checked") == false){
        a.hide();
      }
    });
  });

// function to prevent the user from misusing the sliders min and max volume
  $(".vol").change(function() {
    // the .val() command of jquery return a toString() so it's required to use parseFloat to convert the values
    var minValue = parseFloat($("#minSlider").val());
    var maxValue = parseFloat($("#maxSlider").val());
    // compare min to max value and display a message to the user if needed
    if(minValue > maxValue || maxValue < minValue){
    console.log('error');
    $("#helper").html("Min volume must be below Max volume");
    }
    else{
        $("#helper").html("");
    }
});

// list of all the patterns below
  this.p0 = function () {
    var kvalue = 4;
    $("#kaleidSlider").on("change", function () {
      kvalue = $(this).val();
    });

    hush();
    //the frequency of the osc is also reactive to the sound input (bin 0 and 1)
    osc(() => 80 + a.fft[(0, 1)] * 50)
    //the number of angles is controlled by the slider
      .kaleid(() => 0 + kvalue)
      //the colours of the pattern is altered by the sound input (bin 2 and 3)
      .colorama(() => 2 + a.fft[(2, 3)] * 0.5)
      .out(o0);
    render(o0);
  };

  this.p1 = function () {
    // acid bus seat
    // by Will Humphreys
    hush();
    osc(() => 105 + a.fft[(0, 1)] * 10)
      .color(0.5, 0.1, 0.8)
      .rotate(() => 0.11 + a.fft[(2, 3)], 0.1)
      .modulate(
        osc(10)
          .rotate(() => 0.3 + a.fft[(2, 3)])
          .add(o0, 0.1)
      )
      .add(osc(20, 0.01, 1).color(0, 0.8, 1))
      .out(o0);
    osc(50, 0.05, 0.7)
      .color(1, 0.7, () => 0.5 + a.fft[(2, 3)])
      .diff(o0)
      .modulate(o1, 0.05)
      .out(o1);
    render(o1);
  };

  this.p2 = function () {
    // by Olivia Jack
    hush();
    osc(100, 0.1, () => 1.4 * a.fft[0] + 1)
      .rotate(0, 0.1)
      .mult(osc(10, () => 0.1 + a.fft[0]).modulate(osc(10).rotate(0, -0.1), 1))
      .color(2.83, 0.91, 0.39)
      .out(o0);
    render(o0);
  };

  this.p3 = function () {
    // by Naoto Hieda
    // book of Hydra
    hush();
    n = 50;
    func = () => osc(30, 0.0, 1).modulate(noise(4, 1));
    pix = () => shape(4, 0.3, 0).scale(1, 1, 3).repeat(n, n);
    pix()
      .mult(
        func()
          .color(() => 1 + a.fft[0] * 5, 0, 0)
          .pixelate(n, n)
      )
      .out(o1);
    pix()
      .mult(
        func()
          .color(0, () => 1 + a.fft[1] * 5, 0)
          .pixelate(n, n)
      )
      .scrollX(1 / n / 3)
      .out(o2);
    pix()
      .mult(
        func()
          .color(0, 0, () => 1 + a.fft[2] * 5)
          .pixelate(n, n)
      )
      .scrollX(2 / n / 3)
      .out(o3);
    solid().add(src(o1), 1).add(src(o2), 1).add(src(o3), 1).out(o0);
    render(o0, o1, o2, o3);
  };

  this.p4 = function () {
    // by Naoto Hieda
    // book of Hydra
    hush();
    osc(50, () => -0.02 + a.fft[0] / 100, 1)
      .hue(-0.5)
      .kaleid(1000)
      .luma(0.6, 0)
      .layer(
        osc(30, 0.0, 1)
          .modulate(noise(5), 0.2)
          .luma(() => 0.6 + a.fft[(2, 3)], 0.5)
      )
      .hue(-0.1)
      .out(o1);
    solid()
      .layer(src(o1))
      .modulate(src(o0).saturate(0), 0.08)
      .add(o0, 0.2)
      .blend(o0, 0.8)
      .out(o0);
    render(o0, o1);
  };

  this.p5 = function () {
    // e_e @sebzabs
    //based on // @naoto_hieda
    // https://hydra-editor.glitch.me/?sketch_id=naoto_0
    hush();
    osc(2, 0.6, () => 0 + a.fft[0] * 100)
      .color(0, 1, 2)
      .rotate(1.57 / 2)
      .out(o1);

    osc(3, () => 0.04 + a.fft[2], 1)
      .color(2, 0.7, 1)
      .modulatePixelate(o1, 0.1, () => 0 + a.fft[0])
      .modulateRotate(src(o1))
      .layer(solid(1, 1, 1).mult(gradient(0.25).color(0.5, 0, 0.8)))
      .modulateScale(noise(() => 0 + a.fft[1] / 5))
      .posterize(() => 20 - a.fft[2] / 10)
      .scale(0.25)

      .out(o0);
    render(o0);
  };

  this.p6 = function () {
    // by Janice Bryson
    // @__janicebryson
    hush();
    osc(3, () => -0.2 + a.fft[0] / 150, 50)
      .pixelate(() => 100 - a.fft[(2, 3)] * 50)
      .kaleid(60)
      .saturate(10)
      .hue(100)
      .out(o0);
    render(o0);
  };

  this.p7 = function () {
    //Flor de Fuego
    hush();
    shape(60, 0.5, 1.5)
      .scale(0.5, 0.5)
      .color([0.5, 2].smooth(1), 0.3, () => 0 + a.fft[(2, 3)])
      .repeat(2, 2)
      .modulateScale(
        osc(3, () => 0.5 + a.fft[0] / 80),
        -0.6
      )
      .add(o0, 0.5)
      .scale(() => 0.1 + a.fft[0] / 30)
      .out(o0);
    render(o0);
  };

  this.p8 = function () {
    // by Débora Falleiros Gonzales
    // https://www.gonzalesdebora.com/
    hush();
    osc(1, 1, () => 0.5 + a.fft[3])
      .mult(
        noise(2, () => 0.1 + a.fft[(2, 3)] / 20),
        0.2
      )
      .add(
        noise(() => 2 + a.fft[0] / 2, 3, 0),
        0.1
      )
      .modulate(osc(500, 10, 0.8))
      .out(o0);
    render(o0);
  };

  this.p9 = function () {
    // by emaxxx
    hush();
    osc(10, () => 1 + a.fft[0] / 2, 1)
      .rotate(1, () => 0.5 + a.fft[2])
      .modulate(noise(() => 5 + a.fft[(2, 3)] * 10))
      .out(o0);
    render(o0);
  };

  this.p10 = function () {
    // by ntnl
    // https://natanaelmanrique.com/
    hush();
    osc(
      4,
      () => 0.1 + a.fft[0] / 3,
      () => 0.8 + a.fft[2]
    )
      .diff(o0)
      .scale(0.5)
      .scale(() => 0.5 + 0.2 * Math.sin(0.1 * time))
      .modulate(
        noise(2.5, 0.1)
          .scale(0.5)
          .pixelate(
            () => 2 + a.fft[0] * 10,
            () => 100 * Math.sin(time * 0.01) + a.fft[3]
          )
      )
      .out(o0);
    render(o0);
  };

  this.p11 = function () {
    //in a wormwhole
    //by Ritchse
    //instagram.com/ritchse
    hush();
    voronoi(() => 200 - a.fft[0] * 20, 0, 0.05)
      .modulate(osc(2), () => 0.08 + a.fft[0])
      .repeat(3)
      .thresh(0.85)
      .add(
        shape(32, 0.3)
          .modulate(noise(5))
          .modulateRepeat(osc(50).rotate(-0.8), 7)
          .colorama(0.02)
          .hue(() => 0.7 + a.fft[2] / 5)
          .modulate(src(o0).scale(1.2)),
        0.6
      )
      .add(o0, 0.55)
      .modulateRotate(
        osc(() => 5 + a.fft[0] * 2).modulateScrollY(osc(2).rotate())
      )
      .scale(0.75)
      .colorama(0.05)
      .contrast(0.9)
      .out();
    render(o0);
  };

  this.p12 = function () {
    // by Luis Aguirre @laguirrepop
    hush();
    var ar = window.innerHeight / window.innerWidth;
    var s = 0.13;
    setFunction({
      name: "clampColor",
      type: "color",
      inputs: [
        {
          name: "rb",
          type: "float",
          default: 0.0,
        },
        {
          name: "gb",
          type: "float",
          default: 0.0,
        },
        {
          name: "bb",
          type: "float",
          default: 0.1,
        },
        {
          name: "rt",
          type: "float",
          default: 1.0,
        },
        {
          name: "gt",
          type: "float",
          default: 0.5,
        },
        {
          name: "bt",
          type: "float",
          default: 1.0,
        },
      ],
      glsl: `vec4 c2 = vec4(_c0); c2.r = clamp(c2.r, rb, rt); c2.g = clamp(c2.g, gb, gt); c2.b = clamp(c2.b, bb, bt); return vec4(c2.rgba);`,
    });

    fs = shape(4, () => 0.1 + a.fft[0] / 2, 0.13)
      .hue(0.65)
      .scale(1, 1.5, 0.1)
      .rotate(-0.1)
      .scrollX(0.19)
      .scrollY(0.504)
      .kaleid(20)
      .rotate(() => time * -s);

    voronoi(
      () => 36 + a.fft[3] * 10,
      () => 1 + a.fft[0],
      0.1
    )
      .mask(shape(131.0, 0.36))
      .rotate(() => time * s)
      .repeat(3, 3)
      .out(o2);

    solid(0, 0, 0)
      .add(fs, 1)
      .mult(gradient(0, 0.1).scale(0.36).scrollX(-0.18), 0.5)
      .layer(o2, 0.1)
      .scale(1, ar)
      .mask(shape(4, 1).scale(1, ar, 1))
      .color(1, 1, 0)
      .hue(() => -0.21 + a.fft[3])
      .out(o3);

    solid(0, 0, 0)
      .add(o3, 1)
      .brightness(-0.0075)
      .add(o1, 0.72)
      .hue(0.18)
      .scale(1 - 0.03, -1)
      .out(o1);
    solid(0, 0, 0)
      .add(o1)
      .hue(0.18)

      .out(o0);
    render(o0);
  };

  this.p13 = function () {
    // DONE
    hush();
    osc(
      3,
      () => 0.4 + a.fft[3] / 2,
      () => 5 + a.fft[1] * 10
    )
      .modulate(
        noise(() => 2 + a.fft[0] * 5, 0.05),
        2
      )
      .kaleid(() => time)
      .blend(o0)
      .blend(o0)
      .blend(o0)
      // .scale(() => a.fft[0])
      .out(o0);
    render(o0);
  };

  this.p14 = function () {
    // DONE
    hush();
    osc(
      () => 3 + a.fft[0] * 10,
      () => 0.2 + a.fft[3] / 2,
      () => 2 + a.fft[1] * 50
    )
      .kaleid(6)
      .posterize(() => 10 + a.fft[3] * 10)
      .out(o0);
    render(o0);
  };

  this.p15 = function () {
    // by Olivia Jack
    // @_ojack_
    //ritchse edit
    hush();
    osc(50, 0.09, 0.35)
      .kaleid(90)
      .modulateScale(
        osc(
          () => 20 + a.fft[0] * 20,
          () => 0.1 + a.fft[3] / 2
        ).rotate(0.5),
        0.08
      )
      .color(0.3, 0.91, 1.39)
      .rotate(0, 0.1)
      .modulate(src(o0).modulateRotate(osc(6).rotate(), -0.07), () => 0.04)
      .scale(1.011)
      .blend(
        src(o0)
          .scale(1.018)
          .scrollX(-0.025)
          .modulate(o0, () => 0.01 + a.fft[1] / 2)
          .rotate(-0.05),
        () => 0.65 + Math.sin(time / 3) / 2.6
      )
      .out(o0);
    render(o0);
  };

  this.p16 = function () {
    // by Zach Krall
    // http://zachkrall.online/
    hush();
    osc(255, 0.1, 4)
      .modulate(osc(2, -0.3, 100).rotate(15))
      .add(
        osc(10, -0.9, 900).color(
          () => 0 + a.fft[0],
          0,
          () => 0 + a.fft[(2, 3)]
        )
      )
      .mult(
        shape(() => 9 + a.fft[0] * 10, 0.2, 1)
          .luma()
          .repeatX(2)
          .repeatY(2)
          .colorama(() => 10 + a.fft[3])
      )
      .add(osc(4, () => 0.1 + a.fft[0], 90).color(0.2, 0, 1))
      .kaleid(() => 10 - a.fft[3] * 5)
      .out(o0);
    render(o0);
  };

  this.p17 = function () {
    // DONE
    hush();
    shape(400, () => 0.01 + a.fft[2], 0.286)
      .repeat(40, 40)
      .modulate(
        osc(() => 60 + a.fft[0] * 100, 0)
          .modulateScale(osc(() => 3.715 + a.fft[3], 0.759))
          .kaleid(() => 4 + a.fft[0] * 10),
        0.02
      )
      .out(o0);
    render(o0);
  };

  this.p18 = function () {
    // DONE
    hush();
    osc(() => 9 + a.fft[0], 0.3, 0.21)
      .luma(0.499)
      .modulate(
        noise(7, () => 0.01 + a.fft[0] / 100)
          .kaleid(() => 3 + a.fft[3] * 50)
          .modulateRotate(
            noise(0.6).modulate(noise(5), 0.06),
            () => 2 + a.fft[3] * 2,
            0.21
          ),
        0.3
      )
      .color(-0.51, 0.46, () => 0.77 + a.fft[3] * 2)
      .modulate(o0, 0.1)
      .contrast(2)
      .rotate(() => Math.sin(time / 2))
      .out(o0);
    render(o0);
  };

  this.p19 = function () {
    //Lupita Quispe    :D
    hush();
    voronoi(() => a.fft[0] / 2, 0.01, 30)
      .color(2, 0.7, () => 0.8 + a.fft[3])
      .diff(
        osc(25 + a.fft[1] * 2, 0.2, 10)
          .luma(0.9, 0.9, 0.9)
          .rotate(0.58)
      )
      .kaleid(1)
      .colorama(() => a.fft[(2, 3)])
      .repeatX(-0.9)
      .repeatY(4)
      .modulateRotate(osc(9, 0.1, 30))
      .scale(1)
      .out(o0);
    render(o0);
  };
} //end of patterns

// creates the pattern object
var p = new Patterns();
// call the dot pattern to start with
p.p17();
// this function is inside function.js
mapCanvas();
// reset the size of the starting canvas
resetSize();
