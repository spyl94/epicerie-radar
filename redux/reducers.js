import { combineReducers } from 'redux';

const SELECT = 'epicerie/SELECT';

const initialState = {
    epiceries: [],
    currentSelected: null,
};

function epiceries(state = initialState.epiceries, action) {
    switch (action.type) {
        default:
            return state;
    }
}

export default combineReducers({
    epiceries,
});
