import React, { useState, useEffect, useMemo } from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { Link, useHistory } from 'react-router-dom'
import { tokens } from '../theme'
import '/node_modules/react-pro-sidebar/dist/css/styles.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import CreatePlaceIcon from '@mui/icons-material/AddHome';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import LogoutIcon from '@mui/icons-material/Logout';
import touristIcon from '../../assets/icon.png'

// Item component represents a menu item in the sidebar
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        margin: '0px',
        padding: '0px 0px',
        height: '60px',
      }}
      onClick={() => {
        setSelected({ page_selected: title })
        if (title !== 'Sign Out') {
          define_selected_page(title)
        } else {
          define_selected_page('')
          window.localStorage.removeItem('MAINPAGE_SELECTED')
          window.localStorage.removeItem('SIDEBAR_COLAPSED')
          signOut()
        }
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  )
}

// Function to define the selected page and store it in local storage
const define_selected_page = (page) => {
  window.localStorage.setItem('MAINPAGE_SELECTED', JSON.stringify({ page_selected: page }))
  console.log('define', typeof page, page)
}

// Function to collapse or expand the sidebar and store the state in local storage
const colapse_sidebar = (sidebar_colpased_value) => {
  window.localStorage.setItem(
    'SIDEBAR_COLAPSED',
    JSON.stringify({ colapsed: sidebar_colpased_value })
  )
}

// Sidebar component
const Sidebar = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [isCollapsed, setIsCollapsed] = useState({ colapsed: false })
  const [selected, setSelected] = useState({ page_selected: 'Home' })
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [user, setUser] = useState({})
  const [logged_In, set_Logged_In_Status] = useState(false)
  const history = useHistory()

    // Handle window resize for mobile responsiveness
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 425);
  };

    // Add and remove event listener for window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    // Toggle the sidebar expansion
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

    // Fetch data from local storage on component mount
  useMemo(() => {
    const browser_data = window.localStorage.getItem('LOGIN_STATUS')
    if (browser_data !== null) {
      setUser(JSON.parse(browser_data))
    }
    const page_selected_data = window.localStorage.getItem('MAINPAGE_SELECTED')
    if (page_selected_data !== null) {
      setSelected(JSON.parse(page_selected_data))
    }
    const sidebar_colapsed = window.localStorage.getItem('SIDEBAR_COLAPSED')
    if (sidebar_colapsed !== null) {
      setIsCollapsed(JSON.parse(sidebar_colapsed))
    }
    const theme_mode = window.localStorage.getItem('THEME_MODE')
    if (theme_mode !== null) {
      setIsCollapsed(JSON.parse(theme_mode))
    }
  }, [])

    // Redirect to the Mainpage
  const redirectToPage = () => {
    history.push("/Mainpage")
  };

  useEffect(() => {
  }, [user])

    // Sign out function
  const signOut = () => {
    set_Logged_In_Status(false)
    window.localStorage.setItem(
      'LOGIN_STATUS',
      JSON.stringify({ user_id: '', password: '', logged_in: false, role: '' })
    )
    window.localStorage.setItem('MAINPAGE_SELECTED', JSON.stringify({ page_selected: '' }))
  }
  const overlayClass = isSidebarExpanded ? 'overlay expanded' : 'overlay';

  const sidebarStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: isCollapsed.colapsed ? '60px' : '250px',
    height: '100%',
    backgroundColor: colors.primary[400],
    zIndex: 1,
  };

  return (
    <Box
      sx={{
        '& .pro-sidebar-inner': {
          background: `${colors.primary[400]} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#868dfb !important',
        },
        '& .pro-menu-item.active': {
          color: '#6870fa !important',
        },
      }}
    >
      {isMobile && (
        <IconButton onClick={toggleSidebar} style={{ position: 'fixed', zIndex: 100, left: 5 }}>
          <MenuOutlinedIcon />
        </IconButton>
      )}
      <div style={sidebarStyles}>
        <ProSidebar collapsed={isCollapsed.colapsed}>
          {' '}
          <Menu iconShape="square">
            <MenuItem
              onClick={() => {
                setIsCollapsed({ colapsed: !isCollapsed.colapsed })
                colapse_sidebar(!isCollapsed.colapsed)
              }}
              icon={isCollapsed.colapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: '10px 0 20px 0',
                color: colors.grey[100],
              }}
            >
              {!isCollapsed.colapsed && (
                <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                  <IconButton onClick={() => setIsCollapsed({ colapsed: !isCollapsed.colapsed })}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed.colapsed && (
              <Box mb="5px">
                <Box display="flex" justifyContent="center" onClick={redirectToPage} style={{ cursor: 'pointer', borderRadius: '50%' }} alignItems="center">
                  <img
                    alt="profile-user"
                    width="70px"
                    height="70px"
                    src={touristIcon}
                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    fontSize={'25px'}
                    sx={{ m: '10px 0 0 0' }}
                  >
                    {user.user_id}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed.colapsed ? undefined : '10%'}>
              <Item
                title="Perfil"
                to="/MainPage/Profile"
                icon={<AccountCircleIcon />}
                selected={selected.page_selected}
                setSelected={setSelected}
              />

              <Item
                title="Recomendaciones"
                to="/MainPage/Recomendations"
                icon={<HomeIcon />}
                selected={selected.page_selected}
                setSelected={setSelected}
              />

              <Item
                  title="Mapa"
                  to="/MainPage/Map"
                  icon={<AddLocationAltIcon />}
                  selected={selected.page_selected}
                  setSelected={setSelected}
              />

              <Item
                title="Top recomendaciones"
                to="/MainPage/TopRec"
                icon={<AirlineStopsIcon />}
                selected={selected.page_selected}
                setSelected={setSelected}
              />

              <Item
                title="Nueva recomendación"
                to="/MainPage/CreatePlace"
                icon={<CreatePlaceIcon />}
                selected={selected.page_selected}
                setSelected={setSelected}
              />

              <Item
                title="Cerrar Sesión"
                to="/Login"
                icon={<LogoutIcon />}
                selected={selected.page_selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </div>
      <div className={overlayClass}></div>
    </Box>
  )
}

export default Sidebar