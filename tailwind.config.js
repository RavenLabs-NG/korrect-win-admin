/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			boxShadow: {
				card: "0px 1px 10px 4px #0000000A",
				card2: "0px 1px 4px 0px #00000040"
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
			},
			colors: {
				white: {
					DEFAULT: "#FFF",
					swan: "#EEE",
					pure: "#FFFFFF"
				},
				black: {
					DEFAULT: "#1A1A1A",
					dark: "#000",
					grey: "#767171",
					light: "#979B97",
					neutral: "#4A4F4A"
				},
				grey: {
					DEFAULT: "#E6E6E6",
					main: "#868383",
					neutral: "#FFEBEB",
					light: "#989898",
					border: "#E0E1E0"
				},
				purple: {
					DEFAULT: "#692595",
					light: "#A090FF"
				},
				green: {
					DEFAULT: "#18BB0C",
					light: "#99E403",
					glo: "#382C",
					korrect: "#257985"
				},
				blue: {
					DEFAULT: "#5752F4",
					shade: "#F5F5FF",
					light: "#E6E6E6",
					cerulean: "#264EB5"
				},
				red: {
					DEFAULT: "#F01313"
				},
				accents: {
					epl: "#11F1FF",
					pink: "#DF3D59",
					blue: "#5752F4",
					green: "#0EA255",
					mustard: "#F2A33F"
				},
				goldenrod: {
					DEFAULT: "#F79009",
					shade: "#FFFAEB"
				},
				gold: "#F2A92C",
				overlay: "#00000066",
				transparent: "transparent"
			}
		}
	},
	plugins: []
};
