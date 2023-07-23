import style from './Hud.module.css';

export const Hud = () => {
  return (
    <div className={style.hud__container}>
      <section className={style.hud__section}>
        <h3 className={style.hud__container__title}>
          New people have arrived!
        </h3>
        <div className={style.hud__item}>
          <div className={style.hud__item__label}>Stats</div>
          <div className={style.hud__item__value}>🍻 | 🌊 | 🔋 | 🗣️</div>
        </div>
        <div className={style.hud__item}>
          <div className={style.hud__item__label}>Person name...</div>
          <div className={style.hud__item__value}>100 | 40 | 36 | 30</div>
        </div>
      </section>
    </div>
  );
};
