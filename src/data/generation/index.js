import {parseCSV, parseDate} from '../../helpers/format.js';

export const solar = require('./solar.csv').map(parseCSV);

export const pvClear = [
  {date: "00:00", value: 0.0},
  {date: "01:00", value: 0.0},
  {date: "02:00", value: 0.0},
  {date: "03:00", value: 0.0},
  {date: "04:00", value: 0.0},
  {date: "05:00", value: 0.0},
  {date: "06:00", value: 0.1},
  {date: "07:00", value: 0.2},
  {date: "08:00", value: 0.3},
  {date: "09:00", value: 0.4},
  {date: "10:00", value: 0.5},
  {date: "11:00", value: 0.65},
  {date: "12:00", value: 0.8},
  {date: "13:00", value: 0.65},
  {date: "14:00", value: 0.5},
  {date: "15:00", value: 0.4},
  {date: "16:00", value: 0.3},
  {date: "17:00", value: 0.2},
  {date: "18:00", value: 0.1},
  {date: "19:00", value: 0.0},
  {date: "20:00", value: 0.0},
  {date: "21:00", value: 0.0},
  {date: "22:00", value: 0.0},
  {date: "23:00", value: 0.0},
  {date: "24:00", value: 0.0}
].map(parseDate);
