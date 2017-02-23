// @flow
type State = {
  modalVisible: boolean,
};

const initialState : State = {
    modalVisible: false,
};

export const startShowMapScreenTimer = (dispatch: Function) => {
  setTimeout(() => {
    dispatch({type: 'SHOW_MAP_SCREEN'})
  }, 6000);
}

export const showModal = () => ({
  type: 'SHOW_MODAL',
})

export const hideModal = () => ({
  type: 'HIDE_MODAL',
})

export default function application(state : State = initialState, action : Object): State {
    switch (action.type) {
        case 'SET_INITIAL_LOCATION':
          return {...state, 'showMap': true };
        case 'SHOW_MODAL':
          return {...state, 'modalVisible': true };
        case 'HIDE_MODAL':
          return {...state, 'modalVisible': false };
        default:
            return state;
    }
}
