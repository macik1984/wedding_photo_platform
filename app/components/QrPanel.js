'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/**
 * QR kod sa kresli priamo v prehliadaci. Predtym ho generovala cudzia sluzba,
 * co znamenalo, ze adresa akcie odchadzala na cudzi server a funkcia by
 * prestala fungovat, keby ta sluzba zanikla.
 *
 * Na obrazovku ide SVG s priehladnym pozadim, na stiahnutie PNG s bielym,
 * lebo tlaciaren s priehladnostou nepocita.
 */
export default function QrPanel({ url, t, fileName }) {
  const [open, setOpen] = useState(false);
  const [svg, setSvg] = useState('');
  const [png, setPng] = useState('');

  useEffect(() => {
    if (!open) return;
    let alive = true;

    QRCode.toString(url, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#101626ff', light: '#00000000' },
    })
      .then((out) => alive && setSvg(out))
      .catch(() => {});

    QRCode.toDataURL(url, {
      width: 1200,
      margin: 3,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000ff', light: '#ffffffff' },
    })
      .then((out) => alive && setPng(out))
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [open, url]);

  return (
    <>
      <button type="button" className="ui-btn ui-btn--glass" onClick={() => setOpen(!open)}>
        {open ? t.qrHide : t.qr}
      </button>

      {open && (
        <div className="ui-qr">
          <div className="code" dangerouslySetInnerHTML={{ __html: svg }} />
          <div className="side">
            <p className="ui-hint" style={{ marginTop: 0 }}>
              {t.qrNote}
            </p>
            {png && (
              <a className="ui-btn ui-btn--glass" href={png} download={`${fileName}-qr.png`}>
                {t.qrDownload}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
