/* @flow */
const initialState = {
    modalVisible: false,
    showMap: false,
};

export const startShowMapScreenTimer = (dispatch: Function) => {
  setTimeout(() => {
    dispatch({type: 'SHOW_MAP'})
  }, 6000);
}

export const showModal = () => ({
  type: 'SHOW_MODAL',
})

export const hideModal = () => ({
  type: 'HIDE_MODAL',
})

export default function application(state = initialState, action) {
    switch (action.type) {
        case 'SET_INITIAL_LOCATION':
          return {...state, 'showMap': true };
        case 'SHOW_MAP':
          return {...state, 'showMap': true };
        case 'SHOW_MODAL':
          return {...state, 'modalVisible': true };
        case 'HIDE_MODAL':
          return {...state, 'modalVisible': false };
        default:
            return state;
    }
}
