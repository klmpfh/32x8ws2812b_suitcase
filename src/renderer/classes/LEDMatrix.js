const LED = require('./LED');

const settings = require('../../ledout/settings.json');

class LEDMatrix {

  #matrix;
  #strip;

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} init_r
   * @param {Number} init_g
   * @param {Number} init_b
   */
  constructor(
    x = settings.leds_x,
    y = settings.leds_y,
    // strip_way = 'snake', strip_start = 'bttom left up', // puh .... fits in my case ... there is no other option :/
    init_r = 0,
    init_g = 0,
    init_b = 0,
  ) {

    // gen a matrix of LEDs
    this.#matrix = new Array(x)
      .fill(0)
      .map(line => {
        return new Array(y)
          .fill(0)
          .map(pixel => {
            return new LED(
              init_r,
              init_g,
              init_b,
            );
          });
      });

    this.#strip = new Array(x*y)
      .fill(0)
      .map((pixel, pixel_index) => {
        // 0 ==> [31][0]
        // 8 ==> [30][7]

        const inner_x = (settings.leds_x - 1) - Math.floor(pixel_index / 8);
        const way_up = inner_x % 2 == 1; // odd is up
        const inner_y = Math.abs((settings.leds_y-1) - (way_up ? 0 : (settings.leds_y - 1)) - (pixel_index % settings.leds_y));

        // ah ... its upside down ...


        return this.#matrix[inner_x][inner_y];
      });
  }

  /**
   * set color on X_Y_pixel
   * @param {Number} x hori index
   * @param {Number} y verti index
   * @param {Number || String} value hex value or colorcode
   * @returns LEDMatrix
   */
  set_pixel_value(x,y,value){
    this.#matrix[x][y].setHex(value);
    return this;
  }

  /**
   * set color on X_Y_pixel
   * @param {Number} x hori index
   * @param {Number} y verti index
   * @param {Number} r red
   * @param {Number} g green
   * @param {Number} b blue
   * @returns LEDMatrix
   */
  set_pixel_rgb(x,y,r,g,b){
    this.#matrix[x][y].r = r;
    this.#matrix[x][y].g = g;
    this.#matrix[x][y].b = b;
    return this;
  }

  get_buffer(){
    return Uint8Array.from(this.#strip.map(LED => LED.rgbArray).flat());
  }

  get_matrix(){
    return this.#matrix;
  }

}

module.exports = LEDMatrix;
