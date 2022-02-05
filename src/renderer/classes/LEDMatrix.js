const LED = require('./LED');

const settings = require('../../../settings').ledout;

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
        const inner_y = Math.abs((way_up ? 0 : (settings.leds_y - 1)) - (pixel_index % settings.leds_y));

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
  set_pixel(x,y,value){
    this.#matrix[x][y].setHex(value);
    return this;
  }

  get_buffer(){
    return this.#strip.map(LED => LED.rgbArray).flat();
  }

  get_matrix(){
    return this.#matrix;
  }

}

module.exports = LEDMatrix;
