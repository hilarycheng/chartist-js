/**
 * @module Chartist
 */

import Core from './core';
import Interpolation from "./interpolation";
import Svg from "./svg";
import Bar from "./charts/bar";
import Line from "./charts/line";
import Pie from "./charts/pie";
import Event from "./event";

let Chartist = {
  ...Core,
  Interpolation,
  Svg,
  Bar,
  Line,
  Pie,
  Event

}

export {
  Interpolation,
  Svg,
  Bar,
  Line,
  Pie,
  Event
}

export { Chartist as default }
