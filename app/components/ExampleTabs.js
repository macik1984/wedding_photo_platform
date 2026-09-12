'use client';

import { useState } from 'react';
import PhoneMock from './PhoneMock';

/**
 * Ukazky pre rozne typy akcii. Bez nich vyzerala uvodna stranka ako nastroj
 * na svadby, hoci na firemnu akciu ci teambuilding sedi rovnako.
 *
 * Ulohy aj texty su presne tie, ktore organizator dostane po zalozeni akcie
 * s danou sablonou - stranka teda nesubuje nic, co v aplikacii nie je.
 */
export default function ExampleTabs({ examples }) {
  const [i, setI] = useState(0);
  const ex = examples[Math.min(i, examples.length - 1)];

  return (
    <>
      <div className="ui-examples">
        <div className="ui-seg">
          {examples.map((e, k) => (
            <button key={e.key} type="button" data-on={k === i} onClick={() => setI(k)}>
              {e.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="ui-split">
        <ul className="ui-missioncards">
          {ex.missions.map((m, k) => (
            <li className="ui-missioncard" key={`${ex.key}-${m}`} style={{ '--i': k }}>
              <span className="tick" aria-hidden="true" />
              {m}
            </li>
          ))}
        </ul>

        <div className="ui-splitphone" aria-hidden="true">
          <PhoneMock t={ex.phone} vars={ex.vars} missions={ex.missions} variant="missions" />
        </div>
      </div>
    </>
  );
}
