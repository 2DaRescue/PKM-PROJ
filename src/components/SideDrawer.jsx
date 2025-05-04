import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, IconButton, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook'

const drawerWidthOpen = 200;
const drawerWidthClosed = 60;

export default function SideDrawer({ open, setOpen, onLogout }) {
  const toggleDrawer = () => setOpen(!open);
  const navigate = useNavigate();

  const drawerItems = [
    { text: 'Home', icon: <HomeIcon />,action: () => navigate('/')},
    { text: 'Items', icon: <InventoryIcon />, action: () => navigate('/items') }, 
    { text: 'Moves', icon: <MenuBookIcon />, action: () => navigate('/moves') },
    { text: 'Leave', icon: <LogoutIcon />, action: onLogout },
  ];
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>

      <List>
  {drawerItems.map((item) => (
    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
      <ListItemButton

      onClick={item.action} 
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>

        {open && <ListItemText primary={item.text} />}
        {/* No need for a second <ListItemIcon /> */}
      </ListItemButton>
    </ListItem>
  ))}
</List>

    </Drawer>
  );
}
