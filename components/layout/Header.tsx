interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  back?: string
}

export default function Header({ title, subtitle, action, back }: HeaderProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(247,248,245,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E3E7E1',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          {back && (
            <a
              href={back}
              style={{
                color: '#68736D',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                padding: '4px',
                marginLeft: '-4px',
                borderRadius: '8px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#18201C',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '12px', color: '#68736D', marginTop: '2px' }}>{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </header>
  )
}
