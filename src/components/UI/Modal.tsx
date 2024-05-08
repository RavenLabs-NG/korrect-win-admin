import { ClickOutside } from "@/src/hooks/useClickOutside";
import React, { ReactNode } from "react";

type Props = {
	control: boolean;
	close: (v: boolean) => void;
	children: ReactNode;
};

export default function Modal({ control, close, children }: Props) {
	return (
		<>
			<div
				className={`fixed h-screen w-screen bg-black-dark top-0 left-0 bg-opacity-40 z-[55] ${
					control ? "block" : "hidden"
				}`}
				onClick={() => close(false)}
			/>
			<ClickOutside
				//@ts-ignore
				className={`fixed modal-width ${control ? "z-[60]" : "-z-4"}`}
				style={{
					left: "50%",
					top: "50%",
					opacity: control ? 1 : 0,
					display: control ? "block" : "none",
					transition: "opacity 0.3s ease-in-out",
					transform: "translate(-50%,-50%)"
				}}
				onclickoutside={() => close(false)}
			>
				{control && <div className="relative">{children}</div>}
			</ClickOutside>
		</>
	);
}
