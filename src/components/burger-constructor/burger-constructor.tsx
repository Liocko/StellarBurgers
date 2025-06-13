import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient } from '../../utils/types';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.order.isLoading);
  const orderModalData = useSelector((state) => state.order.order);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(item => item._id),
      constructorItems.bun._id
    ];
    
    dispatch(createOrder(ingredientIds));
  };
  
  const closeOrderModal = () => {
    dispatch(clearOrder());
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
