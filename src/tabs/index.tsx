import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardContent from "./dashboard";
import Employees from "./employees";
import Locations from "./location";
import Chats from "./chats";
import Setting from "./setting";
import { primary } from "../../theme/color";
import { Font, Heading, Title } from "../../theme/type";
import Div from "../components/atom/Div";

const drawerWidth = 180;

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    component: <DashboardContent />,
  },
  // {
  //   label: "Company",
  //   icon: <BusinessIcon fontSize="small" />,
  //   component: <Company />,
  // },
  {
    label: "Employees",
    icon: <GroupIcon fontSize="small" />,
    component: <Employees />,
  },
  {
    label: "Locations",
    icon: <LocationOnIcon fontSize="small" />,
    component: <Locations />,
  },
  { label: "Chats", icon: <ChatIcon fontSize="small" />, component: <Chats /> },
];

const bottomMenuItems = [
  // {
  //   label: "Profile",
  //   icon: <PersonIcon fontSize="small" />,
  //   component: <Profile />,
  // },
  {
    label: "Settings",
    icon: <SettingsIcon fontSize="small" />,
    component: <Setting />,
  },
];
interface CurrentUser {
  avatar: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
const DashboardPage = () => {
  const user: CurrentUser = JSON.parse(localStorage.getItem("user") as string);

  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 960px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (item) => {
    setSelectedItem(item.label);
    if (isMobile) {
      setMobileOpen(false); // Close the drawer on mobile when a menu item is clicked
    }
  };

  const renderDashboardContent = () => {
    const selectedMenuItem = [...menuItems, ...bottomMenuItems].find(
      (item) => item.label === selectedItem
    );
    return selectedMenuItem ? selectedMenuItem.component : null;
  };

  const drawer = (
    <Div sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Div>
        <Div
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 4,
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Avatar
            alt="Maria"
            src={user?.avatar}
            sx={{ width: 45, height: 45 }}
          />
          <div>
            <Title>{user?.name}</Title>
            <Font variant="subtitle2">{user?.role}</Font>
          </div>
        </Div>
        <List sx={{ mt: 3 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => handleListItemClick(item)}
              sx={{
                mt: 1,
                bgcolor: selectedItem === item.label ? "white" : primary,
                color: selectedItem === item.label ? primary : "white",
                "&:hover": {
                  bgcolor: selectedItem === item.label ? "white" : primary,
                  color: selectedItem === item.label ? primary : "white",
                },
              }}
            >
              {item.icon}
              <Title
                sx={{
                  ml: 2,
                  fontWeight: 300,
                  fontSize: 13,
                  letterSpacing: 1,
                  color: selectedItem === item.label ? primary : "white",
                }}
              >
                {item.label}
              </Title>
            </ListItem>
          ))}
        </List>
      </Div>
      <Div sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 2 }} />
        <List>
          {bottomMenuItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => handleListItemClick(item)}
              sx={{
                mt: 1,
                bgcolor: selectedItem === item.label ? "white" : primary,
                color: selectedItem === item.label ? primary : "white",
                "&:hover": {
                  bgcolor: selectedItem === item.label ? "white" : primary,
                  color: selectedItem === item.label ? primary : "white",
                },
              }}
            >
              {item.icon}
              <Title
                sx={{
                  ml: 2,
                  fontWeight: 300,
                  fontSize: 13,
                  letterSpacing: 1,
                  color: selectedItem === item.label ? primary : "white",
                }}
              >
                {item.label}
              </Title>
            </ListItem>
          ))}
        </List>
      </Div>
    </Div>
  );

  return (
    <Div sx={{ display: "flex" }}>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: primary,
            color: "white",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Div
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Div sx={{ textAlign: "right" }}>
          {isMobile && (
            <MenuIcon
              sx={{
                mt: 2,
                ml: 2,
                color: "primary",
                cursor: "pointer",
              }}
              onClick={handleDrawerToggle}
            />
          )}
        </Div>
        <Heading sx={{ color: primary }}>{selectedItem}</Heading>
        {renderDashboardContent()}
      </Div>
    </Div>
  );
};

export default DashboardPage;
