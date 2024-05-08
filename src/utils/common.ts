export const formatAmount = (x: any, units = true) => {
	if (typeof x === "number") {
		const num = units ? x.toFixed(0) : x;

		return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	return units ? (0).toFixed(0) : 0;
};

export const formatPhone = (phone: number | string) => {
	const newPhone = String(phone);
	const firstChar = newPhone.substring(0, 1);
	if (!newPhone || newPhone.length < 10 || newPhone.length > 13) return false;

	const phoneNumber =
		firstChar === "0"
			? `234${newPhone.substring(1)}`
			: firstChar === "2"
			? `${newPhone}`
			: `234${newPhone}`;

	return phoneNumber;
};

export const isValidPhone = (n: any) => {
	let number;
	let firstChar;
	const pattern = /^([0]{1})([7-9]{1})([0|1]{1})([\d]{1})([\d]{7,8})$/g;

	if (!n || n.length < 13) return false;

	if (typeof n === "number") {
		number = `0${n}`;
	} else if (typeof n === "string") {
		firstChar = n.substring(0, 1);
		number = firstChar === "0" ? n : `0${n}`;
	} else {
		return false;
	}
	return pattern.test(number.replace(/\s+/g, ""));
};

export const isValidEmail = (v: string) => {
	return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(v);
};

export const isValidPassword = (v: string) => {
	return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v);
};

export const doNothing = (v?: boolean) => {};

export function shuffle<T = any>(newArr: T[]) {
	let currentIndex = newArr.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[newArr[currentIndex], newArr[randomIndex]] = [newArr[randomIndex], newArr[currentIndex]];
	}

	return newArr;
}
