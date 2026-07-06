import { flushSync } from 'react-dom'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Clientes', to: '/clientes' },
]

const Wrapper = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    'sidebar header'
    'sidebar content';

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    grid-template-rows: 64px auto 1fr;
    grid-template-areas:
      'header'
      'sidebar'
      'content';
  }
`

const Header = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
`

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.grayText};
`

const Brand = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.blueDark};
`

const Sidebar = styled.nav`
  grid-area: sidebar;
  background-color: ${({ theme }) => theme.colors.blueDark};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
  }
`

const NavItem = styled(NavLink)`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.grayLight};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.petrolDark};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.petrol};
    color: ${({ theme }) => theme.colors.white};
  }
`

const Content = styled.main`
  grid-area: content;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
`

export function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    flushSync(() => {
      logout()
    })
    navigate('/login', { replace: true, state: null })
  }

  return (
    <Wrapper>
      <Header>
        <Brand>SEA Tecnologia</Brand>
        <UserArea>
          <UserName>{user?.username ?? user?.sub}</UserName>
          <Button type="button" $variant="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </UserArea>
      </Header>
      <Sidebar>
        {navItems.map((item) => (
          <NavItem key={item.to} to={item.to} end>
            {item.label}
          </NavItem>
        ))}
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  )
}
