import moment from 'moment';

const markerUnknown = require('../../../img/marker_unknown_full.png');
const markerOpen = require('../../../img/marker_open_full.png');
const markerClose = require('../../../img/marker_close_full.png');
const markerUnknownSelected = require('../../../img/marker_unknown.png');
const markerOpenSelected = require('../../../img/marker_open.png');
const markerCloseSelected = require('../../../img/marker_close.png');

export const openingStatus = (epicerie: Marker) => {
  const date = moment();
  const currentHour = date.hours();
  let checkingHoursOfPrevDay = false;
  if (currentHour < 6) {
    date.subtract(1, 'day');
    checkingHoursOfPrevDay = true;
  }
  const currentDay = date.format('dddd').slice(0, 3).toLowerCase();
  if (typeof epicerie.hours == "undefined" || !epicerie.hours[currentDay + '_close']) {
    return {
      color: "#F9B254",
      type: "unknown",
      text: "Horaire non disponible..."
    };
  }
  const closingHour = parseInt(epicerie.hours[currentDay + '_close'].slice(0, 2), 10);
  if (
       (checkingHoursOfPrevDay && currentHour > closingHour)
    || (!checkingHoursOfPrevDay && currentHour < closingHour)
  ) {
    return {
      color: '#fa3e3e',
      type: "close",
      text: 'Actuellement fermé',
    };
  }
  return {
    color: '#42b72a',
    type: "open",
    text: "Ouvert jusqu'à " + epicerie.hours[currentDay + '_close']
  };
}

export const getMarkerImage = (type: string, isSelected: boolean) => {
  if (type === "open") {
    if (isSelected) {
      return markerOpenSelected;
    }
    return markerOpen;
  }
  if (type === "close") {
    if (isSelected) {
      return markerCloseSelected;
    }
    return markerClose;
  }
  if (isSelected) {
    return markerUnknownSelected;
  }
  return markerUnknown;
};
