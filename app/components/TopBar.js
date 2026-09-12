import Link from 'next/link';
import LangToggle from './LangToggle';

export default function TopBar({ user, t }) {
  return (
    <nav className="ui-nav">
      <div className="inner">
        <Link href="/admin" className="mark">
          Paparazzi
        </Link>
        <div className="right">
          <span className="who">{user?.email}</span>
          <LangToggle locale={t.code} other={t.other} otherLabel={t.otherLabel} />
          <form action="/api/auth/logout" method="post">
            <button className="ui-btn ui-btn--plain" style={{ padding: '8px 10px', minHeight: 0 }}>
              {t.nav.signOut}
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
