import { FormEvent, MouseEvent, useMemo, useState } from "react";
import { companions, routeCards, weatherCards } from "./data/content";
import { DifficultyFilter } from "./types/app";

function App() {
  const [activeFilter, setActiveFilter] = useState<DifficultyFilter>("all");
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [coordsText, setCoordsText] = useState("Координаттар анықталуда...");
  const [publishLabel, setPublishLabel] = useState("Топты жариялау");

  const filteredRoutes = useMemo(
    () =>
      activeFilter === "all"
        ? routeCards
        : routeCards.filter((route) => route.difficulty === activeFilter),
    [activeFilter],
  );

  const triggerSOS = () => {
    setIsSosOpen(true);
    setCoordsText("Координаттар анықталуда...");

    if (!navigator.geolocation) {
      setCoordsText("Геолокация қолдауы жоқ");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordsText(
          `${pos.coords.latitude.toFixed(5)}° Е, ${pos.coords.longitude.toFixed(5)}° С`,
        );
      },
      () => {
        setCoordsText("Координаттар қолжетімді емес");
      },
    );
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      alert("Геолокация қолдауы жоқ");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;

        if (navigator.share) {
          await navigator.share({ title: "Менің орналасқан жерім", url });
          return;
        }

        try {
          await navigator.clipboard.writeText(url);
          alert("Сілтеме көшірілді!");
        } catch {
          alert(url);
        }
      },
      () => {
        alert("Геолокацияны алу мүмкін болмады");
      },
    );
  };

  const onModalBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsSosOpen(false);
    }
  };

  const onPublishGroup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPublishLabel("Жарияланды!");

    const form = event.currentTarget;
    window.setTimeout(() => {
      setPublishLabel("Топты жариялау");
      form.reset();
    }, 2500);
  };

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <a href="#" className="logo">
            <div className="logo__mark">
              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 17 L6 7 L10 12 L14 5 L19 17Z" />
              </svg>
            </div>
            <span className="logo__text">
              Tau<span>GO</span>
            </span>
          </a>
          <nav>
            <a href="#routes">Маршруттар</a>
            <a href="#weather">Ауа райы</a>
            <a href="#tips">Кеңестер</a>
            <a href="#companions">Серіктер</a>
            <a href="#sos" className="nav__sos">
              SOS
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero__bg" />
        <svg
          className="hero__mountains"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A6741" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2C2418" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a3d28" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2818" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points="0,400 200,150 380,280 560,80 720,220 900,40 1100,200 1300,100 1440,180 1440,400"
            fill="url(#m1)"
          />
          <polygon
            points="0,400 150,220 320,300 500,160 680,260 850,100 1020,240 1200,150 1440,220 1440,400"
            fill="url(#m2)"
          />
          <polygon
            points="0,400 100,280 250,340 400,240 600,320 750,200 900,300 1100,220 1300,280 1440,240 1440,400"
            fill="url(#m3)"
          />
        </svg>

        <div className="hero__content">
          <div className="hero__eyebrow">
            <div className="hero__eyebrow-dot" />
            <span className="hero__eyebrow-text">Қазақстанның тау маршруттары</span>
          </div>
          <h1>
            Таулар
            <br />
            <em>шақырады</em>
          </h1>
          <p className="hero__sub">
            Маршруттарды табыңыз, ауа райын тексеріңіз және сенімді серіктерді іздеңіз
          </p>
          <div className="hero__cta">
            <a href="#routes" className="btn btn--primary">
              Маршрут іздеу
            </a>
            <a href="#companions" className="btn btn--ghost">
              Серік табу
            </a>
          </div>
          <div className="hero__scroll">
            <div className="hero__scroll-line" />
            <span>Төмен қараңыз</span>
          </div>
        </div>
      </section>

      <section className="section" id="routes">
        <div className="container">
          <div className="section__head">
            <p className="section__label">Маршруттар</p>
            <h2 className="section__title">
              Танымал трек
              <br />
              жолдары
            </h2>
            <p className="section__sub">Барлық деңгей үшін таңдалған маршруттар</p>
          </div>

          <div className="filters">
            <button
              className={`filter ${activeFilter === "all" ? "active" : ""}`}
              type="button"
              onClick={() => setActiveFilter("all")}
            >
              Барлығы
            </button>
            <button
              className={`filter ${activeFilter === "easy" ? "active" : ""}`}
              type="button"
              onClick={() => setActiveFilter("easy")}
            >
              Жеңіл
            </button>
            <button
              className={`filter ${activeFilter === "medium" ? "active" : ""}`}
              type="button"
              onClick={() => setActiveFilter("medium")}
            >
              Орташа
            </button>
            <button
              className={`filter ${activeFilter === "hard" ? "active" : ""}`}
              type="button"
              onClick={() => setActiveFilter("hard")}
            >
              Қиын
            </button>
          </div>

          <div className="cards">
            {filteredRoutes.map((route) => (
              <div className="card" data-difficulty={route.difficulty} key={route.id}>
                <div className={`card__img ${route.imageClass}`}>
                  <div className="card__scene">
                    <div className="scene-icon">{route.sceneIcon}</div>
                    <div className="scene-title">{route.sceneTitle}</div>
                  </div>
                </div>
                <div className="card__body">
                  <div className="card__top">
                    <h3>{route.title}</h3>
                    <span className={`badge badge--${route.difficulty}`}>{route.badgeLabel}</span>
                  </div>
                  <div className="card__meta">
                    <span>📍 {route.location}</span>
                    <span>📏 {route.distance}</span>
                    <span>⏱ {route.duration}</span>
                  </div>
                  <div className="diff-bar">
                    <div className="diff-bar__fill" style={{ width: `${route.progress}%` }} />
                  </div>
                  <p className="card__desc">{route.description}</p>
                  <button className="btn btn--outline" type="button">
                    Толығырақ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark" id="weather">
        <div className="container">
          <div className="section__head">
            <p className="section__label section__label--sand">Ауа райы</p>
            <h2 className="section__title section__title--light">
              Маршруттардағы
              <br />
              жағдай
            </h2>
            <p className="section__sub section__sub--light">Негізгі орындардағы өзекті ауа райы</p>
          </div>

          <div className="weather-grid">
            {weatherCards.map((weather) => (
              <div className="weather-card" key={weather.location}>
                <div className="weather-card__loc">{weather.location}</div>
                <div className="weather-card__row">
                  <div className="weather-card__icon">{weather.icon}</div>
                  <div className="weather-card__temp">{weather.temp}</div>
                </div>
                <div className="weather-card__desc">{weather.description}</div>
                <div className="weather-card__details">
                  <span>💧 {weather.humidity}</span>
                  <span>💨 {weather.wind}</span>
                  <span>👁 {weather.visibility}</span>
                </div>
                <span className={`weather-card__status ${weather.statusClass}`}>
                  {weather.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="difficulty">
        <div className="container">
          <div className="section__head">
            <p className="section__label">Анықтама</p>
            <h2 className="section__title">
              Қиындық
              <br />
              деңгейлері
            </h2>
          </div>
          <div className="diff-legend">
            <div className="diff-item diff-item--easy">
              <div className="diff-item__icon">🟢</div>
              <h4>Жеңіл</h4>
              <ul>
                <li>Күніне 10 км-ге дейін</li>
                <li>Биіктік 400 м-ге дейін</li>
                <li>Арнайы дайындық қажет емес</li>
                <li>Отбасылар мен жаңадан бастаушылар үшін</li>
              </ul>
            </div>
            <div className="diff-item diff-item--medium">
              <div className="diff-item__icon">🟡</div>
              <h4>Орташа</h4>
              <ul>
                <li>Күніне 10–20 км</li>
                <li>Биіктік 400–1000 м</li>
                <li>Дене дайындығы талап етіледі</li>
                <li>Жаяу жүру тәжірибесі ұсынылады</li>
              </ul>
            </div>
            <div className="diff-item diff-item--hard">
              <div className="diff-item__icon">🔴</div>
              <h4>Қиын</h4>
              <ul>
                <li>Күніне 20+ км</li>
                <li>Биіктік 1000+ м</li>
                <li>Альпинистік дайындық</li>
                <li>Арнайы жабдық қажет</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tips" id="tips">
        <div className="container">
          <div className="section__head">
            <p className="section__label">Пайдалы кеңестер</p>
            <h2 className="section__title">
              Тауға шығуға
              <br />
              арналған ережелер
            </h2>
            <p className="section__sub">Жорыққа дейін, маршрут кезінде және төтенше сәтке арналған қысқа чеклист</p>
          </div>

          <div className="tips-columns">
            <div className="tips-card">
              <h3>Жорыққа дейін</h3>
              <ul>
                <li>Бағытты алдын ала зерттеп, офлайн карта жүктеп алыңыз</li>
                <li>Ауа райын 24 сағат бұрын және жолға шығар алдында қайта тексеріңіз</li>
                <li>Жақындарыңызға бағытыңыз бен қайту уақытын хабарлаңыз</li>
                <li>Су, жеңіл ас, дәрі қобдишасы және қуатбанкті ұмытпаңыз</li>
              </ul>
            </div>

            <div className="tips-card">
              <h3>Маршрут кезінде</h3>
              <ul>
                <li>Топтан бөлінбеңіз және қарқынын ең әлсіз қатысушыға сай ұстаңыз</li>
                <li>Әр 40-60 минут сайын қысқа үзіліс жасап, су ішіп отырыңыз</li>
                <li>Белгіленген соқпақтан шықпай, қауіпті жартастарға жақындамаңыз</li>
                <li>Күн батқанша лагерьге немесе бастапқы нүктеге оралу жоспарын сақтаңыз</li>
              </ul>
            </div>

            <div className="tips-card tips-card--alert">
              <h3>Қауіпсіздік ережесі</h3>
              <ul>
                <li>Найзағай, тұман не қатты жел болса, биік нүктеден бірден төмен түсіңіз</li>
                <li>Жарақат алсаңыз, қозғалысты азайтып, жылуды сақтаңыз</li>
                <li>Байланыс жоқ жерде батареяны үнемдеп, SOS тек нақты қауіпте қолданыңыз</li>
                <li>Қоқыс қалдырмаңыз: «Не алып келдіңіз - соны кері алып кетіңіз» қағидасын ұстаныңыз</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark" id="companions">
        <div className="container">
          <div className="section__head">
            <p className="section__label section__label--sand">Серіктер</p>
            <h2 className="section__title section__title--light">Жолдас табу</h2>
            <p className="section__sub section__sub--light">Келесі жорыққа команда тап</p>
          </div>

          <div className="companions-layout">
            <div className="companions-list">
              {companions.map((companion) => (
                <div className="companion" key={companion.name}>
                  <div className="companion__avatar">👤</div>
                  <div className="companion__info">
                    <div className="companion__name">{companion.name}</div>
                    <div className="companion__route">{companion.route}</div>
                    <div className="companion__tags">
                      {companion.tags.map((tag) => (
                        <span className="tag" key={`${companion.name}-${tag}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="btn btn--sm" type="button">
                    Қосылу
                  </button>
                </div>
              ))}
            </div>

            <form className="companions-form" onSubmit={onPublishGroup}>
              <h3>Топ құру</h3>
              <div className="form-group">
                <label htmlFor="route">Маршрут</label>
                <select id="route" name="route">
                  {routeCards.map((route) => (
                    <option key={`option-${route.id}`}>{route.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Күні</label>
                <input id="date" name="date" type="date" />
              </div>
              <div className="form-group">
                <label htmlFor="places">Топтағы орын саны</label>
                <input id="places" name="places" type="number" min="1" max="20" placeholder="Мысалы: 4" />
              </div>
             
              <div className="form-group">
                <label htmlFor="description">Сипаттама</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Маршрут пен талаптарыңыз туралы айтыңыз..."
                />
              </div>
              <button className="btn btn--primary btn--full" type="submit">
                {publishLabel}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="section sos-section" id="sos">
        <div className="container">
          <div className="section__head">
            <p className="section__label section__label--danger">Қауіпсіздік</p>
            <h2 className="section__title">Төтенше жәрдем</h2>
            <p className="section__sub">Қауіп төнгенде — осы құралдарды бірден пайдаланыңыз</p>
          </div>

          <div className="sos-grid">
            <div className="sos-main">
              <div className="sos-main__icon">🆘</div>
              <h3>SOS сигналы</h3>
              <p>Координаттарыңызды құтқару қызметіне жіберіңіз</p>
              <button className="btn btn--sos" onClick={triggerSOS} type="button">
                SOS — СИГНАЛ ЖІБЕРУ
              </button>
              <div className="sos-main__note">Тек нақты қауіп төнгенде пайдаланыңыз</div>
            </div>

            <div className="sos-actions">
              <div className="sos-action">
                <div className="sos-action__icon">📞</div>
                <div className="sos-action__info">
                  <h4>Тау құтқару қызметі</h4>
                  <p>Тәулік бойы, бүкіл Қазақстан бойынша</p>
                </div>
                <a href="tel:101" className="btn btn--call">
                  101
                </a>
              </div>
              <div className="sos-action">
                <div className="sos-action__icon">🏥</div>
                <div className="sos-action__info">
                  <h4>Жедел медициналық жәрдем</h4>
                  <p>Таулардан медициналық эвакуация</p>
                </div>
                <a href="tel:103" className="btn btn--call">
                  103
                </a>
              </div>
              <div className="sos-action">
                <div className="sos-action__icon">🚔</div>
                <div className="sos-action__info">
                  <h4>Полиция / ТЖМ</h4>
                  <p>Іздестіру операцияларын үйлестіру</p>
                </div>
                <a href="tel:112" className="btn btn--call">
                  112
                </a>
              </div>
              <div className="sos-action">
                <div className="sos-action__icon">📡</div>
                <div className="sos-action__info">
                  <h4>Координаттарды жіберу</h4>
                  <p>GPS нүктесін контактіге жіберу</p>
                </div>
                <button className="btn btn--share" onClick={shareLocation} type="button">
                  Жіберу
                </button>
              </div>
            </div>
          </div>

          <div className="sos-tips">
            <h4>Төтенше жағдайда не істеу керек:</h4>
            <div className="tips-grid">
              <div className="tip">
                <div className="tip__num">1</div>
                <span>Орнында қалыңыз — алысқа кетпеңіз</span>
              </div>
              <div className="tip">
                <div className="tip__num">2</div>
                <span>Дыбыстық және визуалды сигнал беріңіз</span>
              </div>
              <div className="tip">
                <div className="tip__num">3</div>
                <span>Соңғы белгілі орналасқан жеріңізді хабарлаңыз</span>
              </div>
              <div className="tip">
                <div className="tip__num">4</div>
                <span>Жылынып, телефон зарядын үнемдеңіз</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <div className="logo footer__logo">
            <div className="logo__mark">
              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 17 L6 7 L10 12 L14 5 L19 17Z" fill="#F5F0E8" />
              </svg>
            </div>
            <span className="logo__text">
              Tau<span>GO</span>
            </span>
          </div>
          <p>Қауіпсіз жолдар мен ашық аспан тілейміз!</p>
          <div className="footer__links">
            <a href="#">Жоба туралы</a>
            <a href="#">Қауіпсіздік ережелері</a>
            <a href="#">Байланыс</a>
          </div>
        </div>
      </footer>

      <div
        className={`modal ${isSosOpen ? "open" : ""}`}
        id="sosModal"
        onClick={onModalBackdropClick}
        role="presentation"
      >
        <div className="modal__box">
          <div className="modal__icon">🆘</div>
          <h3>SOS сигналы жіберілді!</h3>
          <p>
            Координаттарыңыз құтқару қызметіне берілді.
            <br />
            Орнында қалыңыз. Көмек жолда.
          </p>
          <div className="modal__coords" id="modalCoords">
            {coordsText}
          </div>
          <button className="btn btn--primary" onClick={() => setIsSosOpen(false)} type="button">
            Жабу
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
