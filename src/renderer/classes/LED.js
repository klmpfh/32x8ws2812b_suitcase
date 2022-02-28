

const settings = require('../../ledout/settings.json');

class LED {

  #r = 0;
  #g = 0;
  #b = 0;

  /**
   * LED
   *
   * a single LED and his colors
   *
   * @param {Number} init_r initial value of red
   * @param {Number} init_g initial value of green
   * @param {Number} init_b initial value of blue
   */
  constructor(init_r = 0, init_g = 0, init_b = 0) {
    this.#r = this.#floorValue(init_r);
    this.#g = this.#floorValue(init_g);
    this.#b = this.#floorValue(init_b);
  }

  /**
   * #floorValue
   * @param {Number} value value to floor
   * @returns Number between 0 and max_color_value from settings
   */
  #floorValue(value){
    return value % (settings.max_color_value);
  }




  get r() {
    return this.#r;
  }
  get g() {
    return this.#g;
  }
  get b() {
    return this.#b;
  }

  get rgbArray(){
    // let arr = new Uint8Array(3);
    // arr[0] = this.#r;
    // arr[1] = this.#g;
    // arr[2] = this.#b;
    return [
      this.#r,
      this.#g,
      this.#b,
    ];
  }

  set r(new_r) {
    this.#r = this.#floorValue(new_r);
  }
  set g(new_g) {
    this.#g = this.#floorValue(new_g);
  }
  set b(new_b) {
    this.#b = this.#floorValue(new_b);
  }

  setHex(hex){

    if(typeof hex === 'string'){
      // color hex string to number

      // remove '#'
      if(hex[0] == '#') hex = hex.slice(1);

      // error if not matching
      if(!hex.match(/^[0-9a-fA-F]{6}$/)) throw new Error("Please send a color RGB hex String. got: #" + hex);

      hex = parseInt(hex, 16);
    }

    if(typeof hex !== 'number') throw new Error('This hex value ist from type ' + typeof hex + ' and not typeof number or string.');

    this.#b = this.#floorValue(hex);
    hex = hex >> 8;
    this.#g = this.#floorValue(hex);
    hex = hex >> 8;
    this.#r = this.#floorValue(hex);

    return this;

  }

}

module.exports = LED;
