import CameraIcon from './CameraIcon';

/**
 * Ukazka toho, co uvidi host. Cely telefon je kresleny CSS, ziadny obrazok,
 * takze naskoci okamzite a je ostry na kazdom displeji.
 *
 * variant="upload"   - odosielacia obrazovka
 * variant="missions" - ten isty ram so zoznamom foto uloh
 *
 * `vars` prepisuje farby a pisma obrazovky (pouziva nahlad v administracii);
 * bez neho sa kresli predvolena papierova tema.
 */
export default function PhoneMock({ t, missions = [], variant = 'upload', vars, symbol }) {
  return (
    <div className="ui-phone">
      <div className="screen" style={vars}>
        <div className="island" />
        {symbol}
        {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
        {t.names && <p className="names">{t.names}</p>}
        <div className="rule" />
        {t.kicker && <p className="kicker">{t.kicker}</p>}
        {t.sub && <p className="sub">{t.sub}</p>}

        {variant === 'missions' ? (
          <div className="panel">
            <p className="lbl">{t.missionsTitle}</p>
            <ul className="tasks">
              {missions.slice(0, 5).map((m, i) => (
                <li key={`${m}-${i}`}>
                  <span className="tick" data-on={i < 2} aria-hidden="true" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="panel">
            <p className="lbl">{t.nameLabel}</p>
            <div className="box" />
            <div className="drop">
              <span className="cam">
                <CameraIcon />
              </span>
              <b>{t.pick}</b>
            </div>
            <div className="send">{t.send}</div>
          </div>
        )}
      </div>
    </div>
  );
}
