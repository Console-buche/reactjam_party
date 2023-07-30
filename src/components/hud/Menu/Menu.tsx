import './menu.css';
import { useMenuItems } from './useMenuItems';

export const Menu = () => {
  const menuItems = useMenuItems();

  return (
    <div className="menu__container">
      <div className="menu__absolute__wrapper">
        <img src={menuItems.image} alt="invitation" className="menu__image" />
        <div
          className="menu__list"
          style={{
            transform: `translate(-50%, calc(-50% + ${menuItems.offsetY}px))`,
          }}
        >
          {menuItems.items.map((item) => {
            return (
              <div key={item.name} className="menu__item" onClick={item.action}>
                {item.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
