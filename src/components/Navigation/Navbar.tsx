import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { Avatar } from "../UI";
import useData from "@/src/hooks/useData";

type Props = {
	click: () => void;
};

const Navbar = ({ click }: Props) => {
	const {
		dispatch,
		data: { user: { username } }
	} = useData();

	return (
		<header className="w-full mb-3">
			<nav className="flex justify-between items-center lg:!justify-end">
				<div className="lg:hidden">
					<button onClick={click}>
						<MenuOutlinedIcon />
					</button>
				</div>
				<div>
					<div className="border-style bg-white px-2 py-3 flex justify-end items-center gap-2">
						<Avatar
							// @ts-ignore
							size="mm"
							image={"/dude.jpg"}
							name={`KP Admin`}
							className={`h-6 w-6`}
						/>
						<h3 className="text-sm lowercase text-black">{username ?? 'Rapunzel'}</h3>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
