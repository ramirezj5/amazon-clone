export const initialState = {
    basket: [], 
    user: null
}

export const getBasketTotal = (basket) => 
    basket?.reduce((amount, item) => item.price + amount, 0);

// add to basket, or remove from basket 
const reducer = (state, action) => {

switch(action.type) {
    case 'ADD_TO_BASKET': 
        return {
            ...state, 
            basket: [...state.basket, action.item]
        }
    case 'REMOVE_FROM_BASKET':
        // find the id in the basket list and remove from the item 
        const index = state.basket.findIndex((basketItem) => basketItem.id === action.id);
        let newBasket = [...state.basket];

        if(index>=0){
            newBasket.splice(index,1);
        }
        else {
            console.warn(`Can't remove product (id ${action.id}) as it is not in the basket!`)
        }
        return {
            ...state, 
            basket:newBasket
        }
    case 'SET_USER': 
        return {
            ...state,
            user: action.user
        }
    case 'EMPTY_BASKET':   
        return {
            ...state,
            basket: []
        }
    default:
        return state;
}
} 

export default reducer;

