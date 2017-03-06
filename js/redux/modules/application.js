// @flow
type State = {};
const initialState : State = {};

export default function application(state : State = initialState, action : Object): State {
    switch (action.type) {
        default:
            return state;
    }
}
