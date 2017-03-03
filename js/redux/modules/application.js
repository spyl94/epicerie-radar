// @flow
type State = {
  modalVisible: boolean,
};

const initialState : State = {
    modalVisible: false,
};

export const navigateToMapScreen = () => ({type: 'SHOW_MAP_SCREEN'});
export const startShowMapScreenTimer = (dispatch: Function) => {
  setTimeout(() => {
    dispatch(navigateToMapScreen())
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
        case 'SHOW_MODAL':
          return {...state, 'modalVisible': true };
        case 'HIDE_MODAL':
          return {...state, 'modalVisible': false };
        default:
            return state;
    }
}
