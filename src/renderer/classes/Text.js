const Letter = require('./Letter');

module.exports = class Text {

  #letters;
  #letterKeys;
  #letterObjects;

  #lines;
  #lineArray;
  #spacing;


  constructor(text = "", spacing = 1) {

    text = text.toUpperCase();
    text = text.split('\n');

    this.#letters = require('../letters.json');
    this.#letterKeys = Object.keys(this.#letters).sort((keya, keyb) => {
      const a = keya.length;
      const b = keyb.length;
      if(a < b) return 1;
      if(a > b) return -1;
      return 0;
    });

    this.#letterObjects = {};

    this.#letterKeys.forEach(key => {
      this.#letterObjects[key] = new Letter(key);
    });

    this.#lines = text;
    this.#spacing = spacing;

    this.#renderText();

  }

  #renderText() {


    this.#lineArray = [];

    for(let line_index in this.#lines) {

      // cleart lineArry on this index
      this.#lineArray[line_index] = [];

      // temp copy of text
      let str = this.#lines[line_index];

      // Array of letters
      let charArr = [];

      while(str.length > 0) {
        let test = null;

        for(let key of this.#letterKeys) {

          test = str.startsWith(key);

          if(test){
            test = key;
            break;
          }

        }

        let letterArray;

        if(test) {
          letterArray = (this.#letterObjects[test].array);
          str = str.slice(test.length);
        } else {
          letterArray = (this.#letterObjects["#ARTEFAKT"].array);
          str = str.slice(1);
        }


        // overwrite "x" with random
        // letterArray = letterArray.map(row => row.map(px => px == "x" ? (Math.random() > 0.6 ? 1 : 0) : px));

        charArr.push(letterArray);

      };

      charArr.forEach((char, char_index) => {
        char.forEach((col, col_index) => {
          this.#lineArray[line_index].push(col);
        });
        if(char_index < charArr.length - 1) {
          for(let i = 0; i < this.#spacing; i++) this.#lineArray[line_index].push(this.#letterObjects['#SPACING'].array[0]);
        }
      });


    }



  };

  get spacing() {
    return this.#spacing;
  }

  get lines() {
    return this.#lines;
  }

  get lineArray() {
    return this.#lineArray;
  }

  get lineInfo() {
    return this.#lineArray.map((textArray, line_index) => {
      return {
        length: textArray.length,
        scrolling: textArray.length > 32,
      };
    })
  }

  set spacing(value) {
    this.#spacing = value;
    this.#renderText();
  }

  set lines(value) {
    this.#lines = value.toUpperCase().split('\n');
    this.#renderText();
  }

};
