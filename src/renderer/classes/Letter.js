const letters = require('../letters.json');
const letterKeys = Object.keys(letters);

module.exports = class Letter{

  #str;
  #arr;

  /**
   * Letter
   * @param {Strting} str Letter String
   */
  constructor(str){

    if(!str) throw new Error("this is a funny letter ... funny, bud no!" + str);

    let upstr = str.toUpperCase();

    if(letterKeys.includes(upstr)){
      this.#str = upstr;
    }else{
      this.#str = "##";
    }

    // this ar rows, we need cols
    let lettArr = letters[this.#str]

    let lettArrConverted = [];

    lettArr.forEach((row, row_index) => {
      row.forEach((px, col_index) => {
        if(!lettArrConverted[col_index]) lettArrConverted[col_index] = [];
        lettArrConverted[col_index][row_index] = px;
      });
    });

    this.#arr = lettArrConverted;

  }

  get string(){
    return this.#str;
  }

  get array(){
    return this.#arr;
  }

}
