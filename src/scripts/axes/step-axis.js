/**
 * The step axis for step based charts like bar chart or step based line charts. It uses a fixed amount of ticks that will be equally distributed across the whole axis length. The projection is done using the index of the data value rather than the value itself, and therefore it's only useful for distribution purpose.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // Ticks to be used to distribute across the axis length. As this axis type relies on the index of the value rather than the value, arbitrary data that can be converted to a string can be used as ticks.
 *   ticks: ['One', 'Two', 'Three'],
 *   // If set to true the full width will be used to distribute the values where the last value will be at the maximum of the axis length. If false the spaces between the ticks will be evenly distributed instead.
 *   stretch: true
 * };
 * ```
 *
 * @module Chartist.StepAxis
 */
import Chartist from '../core';
import Axis from './axis';

class StepAxis extends Axis {

  stepLength;

  constructor(axisUnit, data, chartRect, options) {
    super(axisUnit, chartRect, options.ticks, options);
    // Chartist.StepAxis.super.constructor.call(this,
    //   axisUnit,
    //   chartRect,
    //   options.ticks,
    //   options);

    let calc = Math.max(1, options.ticks.length - (options.stretch ? 1 : 0));
    this.stepLength = this.axisLength / calc;
  }

  /**
   * @param value {number}
   * @param index {number}
   * @param data {Object}
   * @returns {number}
   */
  projectValue(value, index, data) {
    return this.stepLength * index;
  }

  // StepAxis = Chartist.Axis.extend({
  //   constructor: StepAxis,
  //   projectValue: projectValue
  // });

}

export default StepAxis;
