import Link from 'next/link';

export default function TopBar({ user }) {
  return (
    <header className="bar-top">
      <div className="inner">
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <span className="script" style={{ fontSize: 30 }}>
            Paparazzi
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <span className="who">{user?.email}</span>
          <form action="/api/auth/logout" method="post">
            <button className="btn btn--quiet btn--auto" style={{ padding: '8px 14px', minHeight: 0, fontSize: 11 }}>
              Odhlásiť
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
