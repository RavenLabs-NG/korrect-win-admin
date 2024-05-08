import React from "react";

const Loader = () => {
	return (
		<div className="loading w-full h-screen relative z-10 flex justify-center items-center">
			<div
                className={`h-40 w-40 flex justify-center items-center relative my-3 overflow-hidden text-crimson-text font-medium text-xl`}
			>
				Loading
				<div className="spin_one absolute w-full h-full rounded-full border-4 border-transparent border-dotted"></div>
				<div className="spin_two absolute w-full h-full rounded-full border-4 border-transparent border-dotted"></div>
				<div className="spin_three absolute w-full h-full rounded-full border-4 border-transparent border-dotted"></div>
			</div>
		</div>
	);
};

export default Loader;
