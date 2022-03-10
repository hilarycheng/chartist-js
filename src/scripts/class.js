/**
 * This module provides some basic prototype inheritance utilities.
 *
 * @module Class
 */

class Class {

  // noinspection JSUnusedGlobalSymbols
  listToArray(list) {
    let arr = [];
    if (list.length) {
      for (let i = 0; i < list.length; i++) {
        arr.push(list[i]);
      }
    }
    return arr;
  }

}

export default Class;
