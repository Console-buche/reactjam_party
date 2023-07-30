import './menu.css';
import { useMenuItems } from './useMenuItems';

export const Menu = () => {
  const { image, menuItemOffset, prependElements, items } = useMenuItems();

  return (
    <div className="menu__container">
      <div className="menu__relative__wrapper">
        <img src={image} alt="invitation background img" />
        <div className="menu__content" style={{ paddingTop: menuItemOffset }}>
          {prependElements ?? null}
          <div className="menu__content__list">
            {items.map((item) => {
              return (
                <div
                  key={item.name}
                  className="menu__item"
                  onClick={item.action}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
