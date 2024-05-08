import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

export const sidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: DashboardOutlinedIcon,
    cName: "mb-1 font-medium text-sm",
  },
  {
    title: "Game Management",
    path: "/games",
    icon: PeopleAltOutlinedIcon,
    cName: "mb-1 font-medium text-sm",
  },
//   {
//     title: "Predictions",
//     path: "/predictions",
//     icon: CategoryOutlinedIcon,
//     cName: "mb-1 font-medium text-sm",
//   },
  {
    title: "Rewards",
    path: "/rewards",
    icon: ReceiptLongOutlinedIcon,
    cName: "mb-1 font-medium text-sm",
  },
  {
    title: "Access Control",
    path: "/admins",
    icon: SettingsOutlinedIcon,
    cName: "mb-1 font-medium text-sm",
  }
];

export type SidebarItem = {
	title: string;
	path: string;
	icon?: any;
	cName?: string;
};
