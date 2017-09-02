import moment from 'moment';
import opening_hours from 'opening_hours';

const markerUnknown = require('../../img/marker_unknown_full.png');
const markerOpen = require('../../img/marker_open_full.png');
const markerClose = require('../../img/marker_close_full.png');
const markerUnknownSelected = require('../../img/marker_unknown.png');
const markerOpenSelected = require('../../img/marker_open.png');
const markerCloseSelected = require('../../img/marker_close.png');

export const openingStatus = (epicerie: Marker) => {
  if (typeof epicerie.openingHours == 'undefined' || !epicerie.openingHours) {
    return {
      color: '#F9B254',
      type: 'unknown',
      text: 'Horaire non disponible...',
    };
  }
  var oh = new opening_hours(epicerie.openingHours);
  var state = oh.getState();
  if (!state) {
    return {
      color: '#fa3e3e',
      type: 'close',
      text: 'Actuellement fermé',
    };
  }
  return {
    color: '#42b72a',
    type: 'open',
    text: "Ouvert jusqu'à " + moment(oh.getNextChange()).format('HH:mm'),
  };
};

export const getMarkerImage = (type: string, isSelected: boolean) => {
  if (type === 'open') {
    if (isSelected) {
      return markerOpenSelected;
    }
    return markerOpen;
  }
  if (type === 'close') {
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
