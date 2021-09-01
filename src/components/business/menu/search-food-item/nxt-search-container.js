import { connect } from 'react-redux';
import { setFoodItem } from '../../../../actions/food-detail-actions';
import SearchFoodItems from './nxt-search-item-home';

const mapDispatchToProps = (dispatch) => {
  return {
    setFoodItem: (foodItem) => {
      dispatch(setFoodItem(foodItem));
    },
  };
};

const mapStateToProps = ({ appState, menuState, cart, language }) => {
  return { appState, menuState, cart, language };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodItems);
