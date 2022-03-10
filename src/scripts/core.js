/**
 * The core module of Chartist that is mainly providing static functions and higher level functions for chart modules.
 *
 * @module Core
 */

import Svg from "./svg";

// noinspection JSClosureCompilerSyntax,JSCommentMatchesSignature,JSUnusedGlobalSymbols,HttpUrlsUsage
export default {

  /**
   * Precision level used internally in Chartist for rounding. If you require more decimal places you can increase this number.
   *
   * @memberof Core
   * @type {number}
   */
  precision: 8,

  /**
   * A map with characters to escape for strings to be safely used as attribute values.
   *
   * @memberof Core
   * @type {Object}
   */
  escapingMap: {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;'
  },

  version: '<%= pkg.version %>',

  // noinspection HttpUrlsUsage
  /**
   * This object contains all namespaces used within Chartist.
   *
   * @memberof Core
   * @type {{svg: string, xmlns: string, xhtml: string, xlink: string, ct: string}}
   */
  namespaces: {
    svg: 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    ct: 'http://gionkunz.github.com/chartist-js/ct'
  },

  /**
   * Replaces all occurrences of subStr in str with newSubStr and returns a new string.
   *
   * @memberof Core
   * @param {String} str
   * @param {String} subStr
   * @param {String} newSubStr
   * @return {String}
   */
  replaceAll: (str, subStr, newSubStr) => {
    return str.replace(new RegExp(subStr, 'g'), newSubStr);
  },

  /**
   * Converts a number to a string with a unit. If a string is passed then this will be returned unmodified.
   *
   * @param {String} value
   * @memberof Core
   * @return {String} Returns the passed number value with unit.
   * @param {string} unit
   */
  ensureUnit: (value, unit) => {
    if (typeof value === 'number') {
      return value.toString() + unit;
    }

    return value.toString();
  },

  /**
   * Converts a number or string to a quantity object.
   *
   * @memberof Core
   * @param {String|Number} input
   * @return {Object} Returns an object containing the value as number and the unit as string.
   */
  quantity: (input) => {
    if (typeof input === 'string') {
      let match = (/^(\d+)\s*(.*)$/g).exec(input);
      return {
        value : +match[1],
        unit: match[2] || undefined
      };
    }
    return { value: input };
  },

  /**
   * This is a wrapper around document.querySelector that will return the query if it's already of type Node
   *
   * @memberof Core
   * @param {String|Node} query The query to use for selecting a Node or a DOM node that will be returned directly
   * @return {Node}
   */
  querySelector: (query) => {
    return query instanceof Node ? query : document.querySelector(query);
  },

  /**
   * Functional style helper to produce array with given length initialized with undefined values
   *
   * @memberof Core
   * @param length
   * @return {Array}
   */
  times: (length) => {
    return Array.apply(null, new Array(length));
  },

  /**
   * Sum helper to be used in reduce functions
   *
   * @memberof Core
   * @param previous
   * @param current
   * @return {*}
   */
  sum: (previous, current) => {
    return previous + (current ? current : 0);
  },

  /**
   * Multiply helper to be used in `Array.map` for multiplying each value of an array with a factor.
   *
   * @memberof Core
   * @param {Number} factor
   * @returns {Function} Function that can be used in `Array.map` to multiply each value in an array
   */
  mapMultiply: (factor) => {
    return (num) => {
      return num * factor;
    }
  },

  /**
   * Add helper to be used in `Array.map` for adding an addend to each value of an array.
   *
   * @memberof Core
   * @param {Number} addend
   * @returns {Function} Function that can be used in `Array.map` to add an addend to each value in an array
   */
  mapAdd: (addend) => {
    return (num) => {
      return num + addend;
    }
  },

  /**
   * Map for multidimensional arrays where their nested arrays will be mapped in serial. The output array will have the length of the largest nested array. The callback function is called with variable arguments where each argument is the nested array value (or undefined if there are no more values).
   *
   * @memberof Core
   * @param {Array} arr
   * @param {function(): T} cb
   * @return {Array}
   */
  serialMap: (arr, cb) => {
    let result = [],
      length = Math.max.apply(null, arr.map((e) => {
        return e.length;
      }))

    this.times(length).forEach((e, index) => {
      let args = arr.map((e) => {
        return e[index];
      })

      result[index] = cb.apply(null, args);
    })

    return result;
  },

  /**
   * This helper function can be used to round values with certain precision level after decimal. This is used to prevent rounding errors near float point precision limit.
   *
   * @memberof Core
   * @param {Number} value The value that should be rounded with precision
   * @param {Number} [digits] The number of digits after decimal used to do the rounding
   * @returns {number} Rounded value
   */
  roundWithPrecision: (value, digits) => {
    let precision = Math.pow(10, digits || this.precision);
    return Math.round(value * precision) / precision;
  },

  /**
   * Helps to simplify functional style code
   *
   * @memberof Core
   * @param {*} n This exact value will be returned by the noop function
   * @return {*} The same value that was provided to the n parameter
   */
  noop: (n) => {
    return n;
  },

  /**
   * Generates a-z from a number 0 to 26
   *
   * @memberof Core
   * @param {Number} n A number from 0 to 26 that will result in a letter a-z
   * @return {String} A character from a-z based on the input number n
   */
  alphaNumerate: (n) => {
    // Limit to a-z
    return String.fromCharCode(97 + n % 26);
  },

  /**
   * Simple recursive object extend
   *
   * @memberof Core
   * @param {Object} target Target object where the source will be merged into
   * @param {Object...} sources This object (objects) will be merged into target and then target is returned
   * @return {Object} An object that has the same reference as target but is extended and merged with the properties of source
   */
  extend: (target) => {
    let i, source, sourceProp;
    target = target || {};

    for (i = 1; i < arguments.length; i++) {
      source = arguments[i];
      for (let prop in source) {
        sourceProp = source[prop];
        if (typeof sourceProp === 'object' && sourceProp !== null && !(sourceProp instanceof Array)) {
          target[prop] = this.extend(target[prop], sourceProp);
        } else {
          target[prop] = sourceProp;
        }
      }
    }

    return target;
  },

  /**
   * This function serializes arbitrary data to a string. In case of data that can't be easily converted to a string, this function will create a wrapper object and serialize the data using JSON.stringify. The outcoming string will always be escaped using Chartist.escapingMap.
   * If called with null or undefined the function will return immediately with null or undefined.
   *
   * @memberof Core
   * @param {Number|String|Object} data
   * @return {String}
   */
  serialize: (data) => {
    if (data === null || data === undefined) {
      return data;
    } else if (typeof data === 'number') {
      data = '' + data;
    } else if (typeof data === 'object') {
      data = JSON.stringify({data: data});
    }

    return Object.keys(this.escapingMap).reduce((result, key) => {
      return this.replaceAll(result.toString(), key, this.escapingMap[key]);
    }, data).toString();
  },

  /**
   * This function de-serializes a string previously serialized with Chartist.serialize. The string will always be unescaped using Chartist.escapingMap before it's returned. Based on the input value the return type can be Number, String or Object. JSON.parse is used with try / catch to see if the unescaped string can be parsed into an Object and this Object will be returned on success.
   *
   * @memberof Core
   * @param {String} data
   * @return {String|Number|Object}
   */
  deserialize: (data) => {
    if (typeof data !== 'string') {
      return data;
    }

    data = Object.keys(this.escapingMap).reduce((result, key) => {
      return this.replaceAll(result, this.escapingMap[key], key);
    }, data);

    try {
      data = JSON.parse(data);
      // noinspection JSUnresolvedVariable
      data = data.data !== undefined ? data.data : data;
    } catch (e) {
    }

    return data;
  },

  /**
   * Create or reinitialize the SVG element for the chart
   *
   * @memberof Core
   * @param {Node} container The containing DOM Node object that will be used to plant the SVG element
   * @param {String} width Set the width of the SVG element. Default is 100%
   * @param {String} height Set the height of the SVG element. Default is 100%
   * @param {String} className Specify a class to be added to the SVG element
   * @return {Svg} The created/reinitialized SVG element
   */
  createSvg: (container, width, height, className) => {
    let svg;

    width = width || '100%';
    height = height || '100%';

    // Check if there is a previous SVG element in the container that contains the Chartist XML namespace and remove it
    // Since the DOM API does not support namespaces we need to manually search the returned list http://www.w3.org/TR/selectors-api/
    // noinspection JSUnresolvedFunction
    Array.prototype.slice.call(container.querySelectorAll('svg')).filter(svg => {
      return svg.getAttributeNS(this.namespaces.xmlns, 'ct');
    }).forEach(svg => {
      container.removeChild(svg);
    });

    // Create svg object with width and height or use 100% as default
    svg = new Svg('svg').attr({
      width: width,
      height: height
    });
    svg.addClass(className);

    svg._node.style.width = width;
    svg._node.style.height = height;

    // Add the DOM node to our container
    container.appendChild(svg._node);

    return svg;
  },

  /**
   * Ensures that the data object passed as second argument to the charts is present and correctly initialized.
   *
   * @param  {Object} data The data object that is passed as second argument to the charts
   * @param {Boolean} [reverse] If true the whole data is reversed by the getDataArray call. This will modify the data object passed as first parameter. The labels as well as the series order is reversed. The whole series data arrays are reversed too.
   * @param {Boolean} [multi] Create a multidimensional array from a series data array where a value object with `x` and `y` values will be created.
   * @return {Object} The normalized data object
   */
  normalizeData: (data, reverse, multi) => {
    let labelCount;
    let output = {
      raw: data,
      normalized: {}
    };

    // Check if we should generate some labels based on existing series data
    output.normalized.series = this.getDataArray({
      series: data.series || []
    }, reverse, multi);

    // If all elements of the normalized data array are arrays we're dealing with
    // multi series data, we need to find the largest series if they are un-even
    if (output.normalized.series.every(value => {
      return value instanceof Array;
    })) {
      // Getting the series with the most elements
      labelCount = Math.max.apply(null, output.normalized.series.map(series => {
        return series.length;
      }));
    } else {
      // We're dealing with Pie data, so we just take the normalized array length
      labelCount = output.normalized.series.length;
    }

    output.normalized.labels = (data.labels || []).slice();
    // Padding the labels to labelCount with empty strings
    Array.prototype.push.apply(
      output.normalized.labels,
      this.times(Math.max(0, labelCount - output.normalized.labels.length)).map(() => {
        return '';
      })
    )

    if (reverse) {
      this.reverseData(output.normalized);
    }

    return output;
  },

  /**
   * This function safely checks if an objects has an owned property.
   *
   * @param {Object} object The object where to check for a property
   * @param {string} property The property name
   * @returns {boolean} Returns true if the object owns the specified property
   */
  safeHasProperty: (object, property) => {
    return object !== null &&
      typeof object === 'object' &&
      object.hasOwnProperty(property);
  },

  /**
   * Checks if a value is considered a hole in the data series.
   *
   * @param {*} value
   * @returns {boolean} True if the value is considered a data hole
   */
  isDataHoleValue: (value) => {
    return value === null ||
      value === undefined ||
      (typeof value === 'number' && isNaN(value));
  },

  /**
   * Reverses the series, labels and series data arrays.
   *
   * @memberof Core
   * @param data
   */
  reverseData: (data) => {
    data.labels.reverse();
    data.series.reverse();
    for (let i = 0; i < data.series.length; i++) {
      if (typeof (data.series[i]) === 'object' && data.series[i].data !== undefined) {
        data.series[i].data.reverse();
      } else if (data.series[i] instanceof Array) {
        data.series[i].reverse();
      }
    }
  },

  /**
   * Convert data series into plain array
   *
   * @memberof Core
   * @param {Object} data The series object that contains the data to be visualized in the chart
   * @param {Boolean} [reverse] If true the whole data is reversed by the getDataArray call. This will modify the data object passed as first parameter. The labels as well as the series order is reversed. The whole series data arrays are reversed too.
   * @param {Boolean} [multi] Create a multidimensional array from a series data array where a value object with `x` and `y` values will be created.
   * @return {Array} A plain array that contains the data to be visualized in the chart
   */
  getDataArray: (data, reverse, multi) => {
    // Recursively walks through nested arrays and convert string values to number and objects with value properties
    // to values. Check the tests in data core -> data normalization for a detailed specification of expected values
    function recursiveConvert(value) {
      if (this.safeHasProperty(value, 'value')) {
        // We are dealing with value object notation, so we need to recurse on value property
        return recursiveConvert(value.value);
      } else if (this.safeHasProperty(value, 'data')) {
        // We are dealing with series object notation, so we need to recurse on data property
        return recursiveConvert(value.data);
      } else if (value instanceof Array) {
        // Data is of type array, so we need to recurse on the series
        return value.map(recursiveConvert);
      } else if (this.isDataHoleValue(value)) {
        // We're dealing with a hole in the data and therefore need to return undefined
        // We're also returning undefined for multi value output
        return undefined;
      } else {
        // We need to prepare multi value output (x and y data)
        if (multi) {
          let multiValue = {};

          // Single series value arrays are assumed to specify the Y-Axis value
          // For example: [1, 2] => [{x: undefined, y: 1}, {x: undefined, y: 2}]
          // If multi is a string then it's assumed that it specified which dimension should be filled as default
          if (typeof multi === 'string') {
            multiValue[multi] = this.getNumberOrUndefined(value);
          } else {
            multiValue.y = this.getNumberOrUndefined(value);
          }

          multiValue.x = value.hasOwnProperty('x') ? this.getNumberOrUndefined(value.x) : multiValue.x;
          multiValue.y = value.hasOwnProperty('y') ? this.getNumberOrUndefined(value.y) : multiValue.y;

          return multiValue;

        } else {
          // We can return simple data
          return this.getNumberOrUndefined(value);
        }
      }
    }

    return data.series.map(recursiveConvert);
  },

  /**
   * Converts a number into a padding object.
   *
   * @memberof Core
   * @param {Object|Number} padding
   * @param {Number} [fallback] This value is used to fill missing values if an incomplete padding object was passed
   * @returns {Object} Returns a padding object containing top, right, bottom, left properties filled with the padding number passed in as argument. If the argument is something else than a number (presumably already a correct padding object) then this argument is directly returned.
   */
  normalizePadding: (padding, fallback) => {
    fallback = fallback || 0;

    return typeof padding === 'number' ? {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    } : {
      top: typeof padding.top === 'number' ? padding.top : fallback,
      right: typeof padding.right === 'number' ? padding.right : fallback,
      bottom: typeof padding.bottom === 'number' ? padding.bottom : fallback,
      left: typeof padding.left === 'number' ? padding.left : fallback
    };
  },

  getMetaData: (series, index) => {
    let value = series.data ? series.data[index] : series[index];
    return value ? value.meta : undefined;
  },

  /**
   * Calculate the order of magnitude for the chart scale
   *
   * @memberof Core
   * @param {Number} value The value Range of the chart
   * @return {Number} The order of magnitude
   */
  orderOfMagnitude: (value) => {
    return Math.floor(Math.log(Math.abs(value)) / Math.LN10);
  },

  /**
   * Project a data length into screen coordinates (pixels)
   *
   * @memberof Core
   * @param {Object} axisLength The svg element for the chart
   * @param {Number} length Single data value from a series array
   * @param {Object} bounds All the values to set the bounds of the chart
   * @return {Number} The projected data length in pixels
   */
  projectLength: (axisLength, length, bounds) => {
    return length / bounds.range * axisLength;
  },

  /**
   * Get the height of the area in the chart for the data series
   *
   * @memberof Core
   * @param {Object} svg The svg element for the chart
   * @param {Object} options The Object that contains all the optional values for the chart
   * @return {Number} The height of the area in the chart for the data series
   */
  getAvailableHeight: (svg, options) => {
    return Math.max((this.quantity(options.height).value || svg.height()) - (options.chartPadding.top +  options.chartPadding.bottom) - options.axisX.offset, 0);
  },

  /**
   * Get highest and lowest value of data array. This Array contains the data that will be visualized in the chart.
   *
   * @memberof Core
   * @param {Array} data The array that contains the data to be visualized in the chart
   * @param {Object} options The Object that contains the chart options
   * @param {String} dimension Axis dimension 'x' or 'y' used to access the correct value and high / low configuration
   * @return {Object} An object that contains the highest and lowest value that will be visualized on the chart.
   */
  getHighLow: (data, options, dimension) => {
    // TODO: Remove workaround for deprecated global high / low config. Axis high / low configuration is preferred
    options = this.extend({}, options, dimension ? options['axis' + dimension.toUpperCase()] : {});

    let highLow = {
      high: options.high === undefined ? -Number.MAX_VALUE : +options.high,
      low: options.low === undefined ? Number.MAX_VALUE : +options.low
    };
    let findHigh = options.high === undefined;
    let findLow = options.low === undefined;

    // Function to recursively walk through arrays and find highest and lowest number
    function recursiveHighLow(data) {
      if (data === undefined) {
        return undefined;
      } else if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
          recursiveHighLow(data[i]);
        }
      } else {
        let value = dimension ? +data[dimension] : +data;

        if (findHigh && value > highLow.high) {
          highLow.high = value;
        }

        if (findLow && value < highLow.low) {
          highLow.low = value;
        }
      }
    }

    // Start to find highest and lowest number recursively
    if (findHigh || findLow) {
      recursiveHighLow(data);
    }

    // Overrides of high / low based on reference value, it will make sure that the invisible reference value is
    // used to generate the chart. This is useful when the chart always needs to contain the position of the
    // invisible reference value in the view i.e. for bipolar scales.
    if (options.referenceValue || options.referenceValue === 0) {
      highLow.high = Math.max(options.referenceValue, highLow.high);
      highLow.low = Math.min(options.referenceValue, highLow.low);
    }

    // If high and low are the same because of misconfiguration or flat data (only the same value) we need
    // to set the high or low to 0 depending on the polarity
    if (highLow.high <= highLow.low) {
      // If both values are 0 we set high to 1
      if (highLow.low === 0) {
        highLow.high = 1;
      } else if (highLow.low < 0) {
        // If we have the same negative value for the bounds we set bounds.high to 0
        highLow.high = 0;
      } else if (highLow.high > 0) {
        // If we have the same positive value for the bounds we set bounds.low to 0
        highLow.low = 0;
      } else {
        // If data array was empty, values are Number.MAX_VALUE and -Number.MAX_VALUE. Set bounds to prevent errors
        highLow.high = 1;
        highLow.low = 0;
      }
    }

    return highLow;
  },

  /**
   * Checks if a value can be safely coerced to a number. This includes all values except null which result in finite numbers when coerced. This excludes NaN, since it's not finite.
   *
   * @memberof Core
   * @param value
   * @returns {Boolean}
   */
  isNumeric: (value) => {
    return value === null ? false : isFinite(value);
  },

  // noinspection SpellCheckingInspection
  /**
   * Returns true on all false values except the numeric value 0.
   *
   * @memberof Core
   * @param value
   * @returns {boolean}
   */
  isFalseyButZero: (value) => {
    return !value && value !== 0;
  },

  /**
   * Returns a number if the passed parameter is a valid number or the function will return undefined. On all other values than a valid number, this function will return undefined.
   *
   * @memberof Core
   * @param value
   * @returns {*}
   */
  getNumberOrUndefined: (value) => {
    return this.isNumeric(value) ? +value : undefined;
  },

  /**
   * Checks if provided value object is multi value (contains x or y properties)
   *
   * @memberof Core
   * @param value
   */
  isMultiValue: (value) => {
    return typeof value === 'object' && ('x' in value || 'y' in value);
  },

  /**
   * Gets a value from a dimension `value.x` or `value.y` while returning value directly if it's a valid numeric value. If the value is not numeric, and it's falsey this function will return `defaultValue`.
   *
   * @memberof Core
   * @param value
   * @param dimension
   * @returns {*}
   */
  getMultiValue: (value, dimension) => {
    if (this.isMultiValue(value)) {
      return this.getNumberOrUndefined(value[dimension || 'y']);
    } else {
      return this.getNumberOrUndefined(value);
    }
  },

  /**
   * Pollard Rho Algorithm to find the smallest factor of an integer value. There are more efficient algorithms for factorization, but this one is quite efficient and not so complex.
   *
   * @memberof Core
   * @param {Number} num An integer number where the smallest factor should be searched for
   * @returns {Number} The smallest integer factor of the parameter num.
   */
  rho: (num) => {
    if (num === 1) {
      return num;
    }

    function gcd(p, q) {
      if (p % q === 0) {
        return q;
      } else {
        return gcd(q, p % q);
      }
    }

    function f(x) {
      return x * x + 1;
    }

    let x1 = 2, x2 = 2, divisor;
    if (num % 2 === 0) {
      return 2;
    }

    do {
      x1 = f(x1) % num;
      x2 = f(f(x2)) % num;
      divisor = gcd(Math.abs(x1 - x2), num);
    } while (divisor === 1);

    return divisor;
  },

  /**
   * Calculate and retrieve all the bounds for the chart and return them in one array
   *
   * @memberof Core
   * @param {Number} axisLength The length of the Axis used for
   * @param {Object} highLow An object containing a high and low property indicating the value range of the chart.
   * @param {Number} scaleMinSpace The minimum projected length a step should result in
   * @param {Boolean} onlyInteger
   * @return {Object} All the values to set the bounds of the chart
   */
  getBounds: (axisLength, highLow, scaleMinSpace, onlyInteger) => {
    let i,
      optimizationCounter = 0,
      newMin,
      newMax,
      bounds = {
        high: highLow.high,
        low: highLow.low
      };

    bounds.valueRange = bounds.high - bounds.low;
    bounds.oom = this.orderOfMagnitude(bounds.valueRange);
    bounds.step = Math.pow(10, bounds.oom);
    bounds.min = Math.floor(bounds.low / bounds.step) * bounds.step;
    bounds.max = Math.ceil(bounds.high / bounds.step) * bounds.step;
    bounds.range = bounds.max - bounds.min;
    bounds.numberOfSteps = Math.round(bounds.range / bounds.step);

    // Optimize scale step by checking if subdivision is possible based on horizontalGridMinSpace
    // If we are already below the scaleMinSpace value we will scale up
    let length = this.projectLength(axisLength, bounds.step, bounds);
    let scaleUp = length < scaleMinSpace;
    let smallestFactor = onlyInteger ? this.rho(bounds.range) : 0;

    // First check if we should only use integer steps and if step 1 is still larger than scaleMinSpace, so we can use 1
    if (onlyInteger && this.projectLength(axisLength, 1, bounds) >= scaleMinSpace) {
      bounds.step = 1;
    } else if (onlyInteger && smallestFactor < bounds.step && this.projectLength(axisLength, smallestFactor, bounds) >= scaleMinSpace) {
      // If step 1 was too small, we can try the smallest factor of range
      // If the smallest factor is smaller than the current bounds.step and the projected length of the smallest factor
      // is larger than the scaleMinSpace we should go for it.
      bounds.step = smallestFactor;
    } else {
      // Trying to divide or multiply by 2 and find the best step value
      while (true) {
        if (scaleUp && this.projectLength(axisLength, bounds.step, bounds) <= scaleMinSpace) {
          bounds.step *= 2;
        } else if (!scaleUp && this.projectLength(axisLength, bounds.step / 2, bounds) >= scaleMinSpace) {
          bounds.step /= 2;
          if (onlyInteger && bounds.step % 1 !== 0) {
            bounds.step *= 2;
            break;
          }
        } else {
          break;
        }

        if (optimizationCounter++ > 1000) {
          throw new Error('Exceeded maximum number of iterations while optimizing scale step!');
        }
      }
    }

    let EPSILON = 2.221E-16;
    bounds.step = Math.max(bounds.step, EPSILON);

    function safeIncrement(value, increment) {
      // If increment is too small use *= (1+EPSILON) as a simple next-after
      if (value === (value += increment)) {
        value *= (1 + (increment > 0 ? EPSILON : -EPSILON));
      }
      return value;
    }

    // Narrow min and max based on new step
    newMin = bounds.min;
    newMax = bounds.max;
    while (newMin + bounds.step <= bounds.low) {
      newMin = safeIncrement(newMin, bounds.step);
    }
    while (newMax - bounds.step >= bounds.high) {
      newMax = safeIncrement(newMax, -bounds.step);
    }
    bounds.min = newMin;
    bounds.max = newMax;
    bounds.range = bounds.max - bounds.min;

    let values = [];
    for (i = bounds.min; i <= bounds.max; i = safeIncrement(i, bounds.step)) {
      let value = this.roundWithPrecision(i);
      if (value !== values[values.length - 1]) {
        values.push(value);
      }
    }
    bounds.values = values;
    return bounds;
  },

  /**
   * Calculate cartesian coordinates of polar coordinates
   *
   * @memberof Core
   * @param {Number} centerX X-axis coordinates of center point of circle segment
   * @param {Number} centerY X-axis coordinates of center point of circle segment
   * @param {Number} radius Radius of circle segment
   * @param {Number} angleInDegrees Angle of circle segment in degrees
   * @return {{x:Number, y:Number}} Coordinates of point on circumference
   */
  polarToCartesian: (centerX, centerY, radius, angleInDegrees) => {
    let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  },

  /**
   * Initialize chart drawing rectangle (area where chart is drawn) x1,y1 = bottom left / x2,y2 = top right
   *
   * @memberof Core
   * @param {Object} svg The svg element for the chart
   * @param {Object} options The Object that contains all the optional values for the chart
   * @param {Number} [fallbackPadding] The fallback padding if partial padding objects are used
   * @return {Object} The chart rectangles coordinates inside the svg element plus the rectangles measurements
   */
  createChartRect: (svg, options, fallbackPadding) => {
    let hasAxis = !!(options.axisX || options.axisY);
    let yAxisOffset = hasAxis ? options.axisY.offset : 0;
    let xAxisOffset = hasAxis ? options.axisX.offset : 0;
    // If width or height results in invalid value (including 0) it will be fallback to the unitless settings or even 0
    let width = svg.width() || this.quantity(options.width).value || 0;
    let height = svg.height() || this.quantity(options.height).value || 0;
    let normalizedPadding = this.normalizePadding(options.chartPadding, fallbackPadding);

    // If settings were too small to cope with offset (legacy) and padding, we'll adjust
    width = Math.max(width, yAxisOffset + normalizedPadding.left + normalizedPadding.right);
    height = Math.max(height, xAxisOffset + normalizedPadding.top + normalizedPadding.bottom);

    let chartRect = {
      padding: normalizedPadding,
      width: function () {
        return this.x2 - this.x1;
      },
      height: function () {
        return this.y1 - this.y2;
      }
    };

    if (hasAxis) {
      if (options.axisX.position === 'start') {
        chartRect.y2 = normalizedPadding.top + xAxisOffset;
        chartRect.y1 = Math.max(height - normalizedPadding.bottom, chartRect.y2 + 1);
      } else {
        chartRect.y2 = normalizedPadding.top;
        chartRect.y1 = Math.max(height - normalizedPadding.bottom - xAxisOffset, chartRect.y2 + 1);
      }

      if (options.axisY.position === 'start') {
        chartRect.x1 = normalizedPadding.left + yAxisOffset;
        chartRect.x2 = Math.max(width - normalizedPadding.right, chartRect.x1 + 1);
      } else {
        chartRect.x1 = normalizedPadding.left;
        chartRect.x2 = Math.max(width - normalizedPadding.right - yAxisOffset, chartRect.x1 + 1);
      }
    } else {
      chartRect.x1 = normalizedPadding.left;
      chartRect.x2 = Math.max(width - normalizedPadding.right, chartRect.x1 + 1);
      chartRect.y2 = normalizedPadding.top;
      chartRect.y1 = Math.max(height - normalizedPadding.bottom, chartRect.y2 + 1);
    }

    return chartRect;
  },

  /**
   * Creates a grid line based on a projected value.
   *
   * @memberof Core
   * @param position
   * @param index
   * @param axis
   * @param offset
   * @param length
   * @param group
   * @param classes
   * @param eventEmitter
   */
  createGrid: (position, index, axis, offset, length, group, classes, eventEmitter) => {
    let positionalData = {};
    positionalData[axis.units.pos + '1'] = position;
    positionalData[axis.units.pos + '2'] = position;
    positionalData[axis.counterUnits.pos + '1'] = offset;
    positionalData[axis.counterUnits.pos + '2'] = offset + length;

    let gridElement = group.elem('line', positionalData, classes.join(' '));

    // Event for grid draw
    eventEmitter.emit('draw',
      this.extend({
        type: 'grid',
        axis: axis,
        index: index,
        group: group,
        element: gridElement
      }, positionalData)
    );
  },

  /**
   * Creates a grid background rect and emits the draw event.
   *
   * @memberof Core
   * @param gridGroup
   * @param chartRect
   * @param className
   * @param eventEmitter
   */
  createGridBackground: (gridGroup, chartRect, className, eventEmitter) => {
    let gridBackground = gridGroup.elem('rect', {
      x: chartRect.x1,
      y: chartRect.y2,
      width: chartRect.width(),
      height: chartRect.height(),
    }, className, true);

    // Event for grid background draw
    eventEmitter.emit('draw', {
      type: 'gridBackground',
      group: gridGroup,
      element: gridBackground
    });
  },

  /**
   * Creates a label based on a projected value and an axis.
   *
   * @memberof Core
   * @param position
   * @param length
   * @param index
   * @param labels
   * @param axis
   * @param axisOffset
   * @param labelOffset
   * @param group
   * @param classes
   * @param useForeignObject
   * @param eventEmitter
   */
  createLabel: (position, length, index, labels, axis, axisOffset, labelOffset, group, classes, useForeignObject, eventEmitter) => {
    let labelElement;
    let positionalData = {};

    positionalData[axis.units.pos] = position + labelOffset[axis.units.pos];
    positionalData[axis.counterUnits.pos] = labelOffset[axis.counterUnits.pos];
    positionalData[axis.units.len] = length;
    positionalData[axis.counterUnits.len] = Math.max(0, axisOffset - 10);

    if (useForeignObject) {
      // We need to set width and height explicitly to px as span will not expand with width and height being
      // 100% in all browsers
      let content = document.createElement('span');
      content.className = classes.join(' ');
      content.setAttribute('xmlns', this.namespaces.xhtml);
      content.innerText = labels[index];
      content.style[axis.units.len] = Math.round(positionalData[axis.units.len]) + 'px';
      content.style[axis.counterUnits.len] = Math.round(positionalData[axis.counterUnits.len]) + 'px';

      labelElement = group.foreignObject(content, this.extend({
        style: 'overflow: visible;'
      }, positionalData));
    } else {
      labelElement = group.elem('text', positionalData, classes.join(' ')).text(labels[index]);
    }

    eventEmitter.emit('draw', this.extend({
      type: 'label',
      axis: axis,
      index: index,
      group: group,
      element: labelElement,
      text: labels[index]
    }, positionalData));
  },

  /**
   * Helper to read series specific options from options object. It automatically falls back to the global option if
   * there is no option in the series options.
   *
   * @param {Object} series Series object
   * @param {Object} options Chartist options object
   * @param {string} key The options key that should be used to obtain the options
   * @returns {*}
   */
  getSeriesOption: (series, options, key) => {
    if (series.name && options.series && options.series[series.name]) {
      let seriesOptions = options.series[series.name];
      return seriesOptions.hasOwnProperty(key) ? seriesOptions[key] : options[key];
    } else {
      return options[key];
    }
  },

  /**
   * Provides options handling functionality with callback for options changes triggered by responsive options and media query matches
   *
   * @memberof Core
   * @param {Object} options Options set by user
   * @param {Array} responsiveOptions Optional functions to add responsive behavior to chart
   * @param {Object} eventEmitter The event emitter that will be used to emit the options changed events
   * @return {Object} The consolidated options object from the defaults, base and matching responsive options
   */
  optionsProvider: (options, responsiveOptions, eventEmitter) => {
    let baseOptions = this.extend({}, options),
      currentOptions,
      mediaQueryListeners = [],
      i;

    let updateCurrentOptions = (mediaEvent) => {
      let previousOptions = currentOptions;
      currentOptions = this.extend({}, baseOptions);

      if (responsiveOptions) {
        for (i = 0; i < responsiveOptions.length; i++) {
          let mql = window.matchMedia(responsiveOptions[i][0]);
          if (mql.matches) {
            currentOptions = this.extend(currentOptions, responsiveOptions[i][1]);
          }
        }
      }

      if (eventEmitter && mediaEvent) {
        eventEmitter.emit('optionsChanged', {
          previousOptions: previousOptions,
          currentOptions: currentOptions
        });
      }
    }

    function removeMediaQueryListeners() {
      mediaQueryListeners.forEach(function (mql) {
        // noinspection JSDeprecatedSymbols
        mql.removeListener(updateCurrentOptions);
      });
    }

    if (!window.matchMedia) {
      throw 'window.matchMedia not found! Make sure you\'re using a polyfill.';
    } else if (responsiveOptions) {

      for (i = 0; i < responsiveOptions.length; i++) {
        let mql = window.matchMedia(responsiveOptions[i][0]);
        // noinspection JSDeprecatedSymbols
        mql.addListener(updateCurrentOptions);
        mediaQueryListeners.push(mql);
      }
    }
    // Execute initially without an event argument, so we get the correct options
    updateCurrentOptions();

    return {
      removeMediaQueryListeners: removeMediaQueryListeners,
      getCurrentOptions: () => {
        return this.extend({}, currentOptions);
      }
    };
  },


  /**
   * Splits a list of coordinates and associated values into segments. Each returned segment contains a pathCoordinates
   * valueData property describing the segment.
   *
   * With the default options, segments consist of contiguous sets of points that do not have an undefined value. Any
   * points with undefined values are discarded.
   *
   * **Options**
   * The following options are used to determine how segments are formed
   * ```javascript
   * var options = {
   *   // If fillHoles is true, undefined values are simply discarded without creating a new segment. Assuming other options are default, this returns single segment.
   *   fillHoles: false,
   *   // If increasingX is true, the coordinates in all segments have strictly increasing x-values.
   *   increasingX: false
   * };
   * ```
   *
   * @memberof Core
   * @param {Array} pathCoordinates List of point coordinates to be split in the form [x1, y1, x2, y2 ... xn, yn]
   * @param {Array} valueData List of associated point values in the form [v1, v2 ... vn]
   * @param {Object} options Options set by user
   * @return {Array} List of segments, each containing a pathCoordinates and valueData property.
   */
  splitIntoSegments: (pathCoordinates, valueData, options) => {
    let defaultOptions = {
      increasingX: false,
      fillHoles: false
    };

    options = this.extend({}, defaultOptions, options);

    let segments = [];
    let hole = true;

    for (let i = 0; i < pathCoordinates.length; i += 2) {
      // If this value is a "hole" we set the hole flag
      if (this.getMultiValue(valueData[i / 2].value) === undefined) {
        // if(valueData[i / 2].value === undefined) {
        if (!options.fillHoles) {
          hole = true;
        }
      } else {
        if (options.increasingX && i >= 2 && pathCoordinates[i] <= pathCoordinates[i - 2]) {
          // X is not increasing, so we need to make sure we start a new segment
          hole = true;
        }


        // If it's a valid value we need to check if we're coming out of a hole and create a new empty segment
        if (hole) {
          segments.push({
            pathCoordinates: [],
            valueData: []
          });
          // As we have a valid value now, we are not in a "hole" anymore
          hole = false;
        }

        // Add to the segment pathCoordinates and valueData
        segments[segments.length - 1].pathCoordinates.push(pathCoordinates[i], pathCoordinates[i + 1]);
        segments[segments.length - 1].valueData.push(valueData[i / 2]);
      }
    }

    return segments;
  }

}
