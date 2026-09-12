import CameraIcon from './CameraIcon';

/**
 * Ukazka toho, co uvidi host. Cely telefon je kresleny CSS, ziadny obrazok,
 * takze naskoci okamzite a je ostry na kazdom displeji.
 *
 * variant="upload"   - odosielacia obrazovka
 * variant="missions" - ten isty ram so zoznamom foto uloh
 */
export default function PhoneMock({ t, missions = [], variant = 'upload' }) {
  return (
    <div className="ui-phone">
      <div className="screen">
        <div className="island" />
        <p className="eyebrow">{t.eyebrow}</p>
        <p className="names">{t.names}</p>
        <div className="rule" />
        <p className="kicker">{t.kicker}</p>
        <p className="sub">{t.sub}</p>

        {variant === 'missions' ? (
          <div className="panel">
            <p className="lbl">{t.missionsTitle}</p>
            <ul className="tasks">
              {missions.slice(0, 5).map((m, i) => (
                <li key={m}>
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
