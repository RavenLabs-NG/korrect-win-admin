import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { sidebarData, SidebarItem } from "./SidebarData";
import useData from "@/src/hooks/useData";

type Props = {
	click: () => void;
	showSidebar: boolean;
};

const Sidebar = ({ click, showSidebar }: Props) => {
	const { pathname, push } = useRouter();

	return (
		<>
			<div
				className={`fixed h-screen w-screen bg-black-dark text-black top-0 left-0 bg-opacity-25 z-40 ${
					showSidebar ? "block" : "hidden"
				} lg:!hidden`}
				onClick={click}
			></div>
			<div
				className={`w-[273px] bg-white fixed top-0 z-50 left-0 py-8 flex-col justify-between items-start h-screen border-r-grey-border border-r-[0.6px] border-r-solid ${
					showSidebar ? "flex" : "hidden"
				} lg:!flex`}
			>
				<div className="w-full">
					<div className="mb-4 px-6">
						<Image 
                            width={150}
                            height={150}
                            src={'/korrect-logo.svg'}
                            alt="Korrect Logo"
                        />
					</div>
					<div className="links">
						<ul>
							{sidebarData.map((item: SidebarItem) => (
								<li
									key={item.title}
                                    className={`rounded-lg w-full py-3 px-6 ${item.cName}lg:hover:bg-green-light ${
                                        pathname.includes(item.path)
                                            ? "bg-green-korrect bg-opacity-15 !text-green-korrect"
                                            : "menu-item"}`}
								>
									<Link href={item.path} passHref>
										<div className={`menu-content flex items-center gap-3`}>
											<div
												className={`flex-none text-black-grey ${
                                                    pathname.includes(item.path) &&
                                                    "!text-green-korrect"
												}`}
											>
												{<item.icon />}
											</div>
											<span
												className={` text-sm text-black-neutral ${
                                                    pathname.includes(item.path) &&
                                                    "!text-green-korrect"}`}
											>
												{item.title}
											</span>
										</div>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="px-4 w-full">
					<div
                        className={`user border-red border rounded-lg w-full mt-8 flex items-center py-3 px-5 space-x-2 cursor-pointer text-crimson`}
						onClick={() => {
							localStorage.removeItem("korrecto");
							deleteCookie("korrecto");
							push("/login");
						}}
					>
						<LogoutOutlinedIcon sx={{ color: "red" }} />
						<p
                            className={`text-sm text-red font-semibold`}
						>
							Logout
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
