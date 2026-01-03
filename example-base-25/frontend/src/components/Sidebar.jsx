import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { to: '/welcome', label: 'Welcome' },
  { to: '/login', label: 'Login' },
  { to: '/signup', label: 'Signup' },
]

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={collapsed ? 'sidebar sidebar-collapsed' : 'sidebar'}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Navigation</h2>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '>>' : '<<'}
        </button>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
