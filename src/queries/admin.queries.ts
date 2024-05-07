import { queryClient, altQueryClient, nextError } from "../utils/queryClient";

type TLogin = {
	email: string;
	password: string;
};

export const logInUser = async (payload: TLogin) => {
	const { data } = await queryClient()
		.post("/web/admin/login", payload)
		.catch(e => nextError(e));
	return data;
};

export const getLeagues = async () => {
	const { data } = await altQueryClient()
		.get("/admin/api/leagues")
		.catch(e => nextError(e));
	return data;
};

export const getTeams = async () => {
	const { data } = await queryClient()
		.get("/admin/api/teams")
		.catch(e => nextError(e));
	return data;
};

type QSubscribers = {
	token: string;
	page: number;
};

export const getAllSubscribers = async ({ token, page }: QSubscribers) => {
	const { data } = await queryClient(token)
		.get(`/v1/admin/subscribers?page=${page ? page : 1}`)
		.catch(e => nextError(e));
	return data.data;
};

export const getSubscriberById = async ({
	token,
	id
}: {
	token: string;
	id: string;
}) => {
	const { data } = await queryClient(token)
		.get(`/admin/subscribers/${id}`)
		.catch(e => nextError(e));
	return data;
};

type TCreateGameSet = {
	date: string;
	status: boolean;
	fixtures: string[];
};

export const createGameSets = async (payload: TCreateGameSet) => {
	const { data } = await queryClient()
		.post(`/v1/admin/games`, payload)
		.catch(e => nextError(e));
	return data;
};

type TUpdateGameSet = {
	date: string;
	setId: string;
	status: boolean;
	fixtures: string[];
};

export const updateGameSet = async (payload: TUpdateGameSet) => {
	const { data } = await queryClient()
		.put(`/v1/admin/games`, payload)
		.catch(e => nextError(e));
	return data;
};

export const getGameSets = async ({
	page,
	pageSize
}: {
	page: number;
	pageSize: number;
}) => {
	const { data } = await queryClient()
		.get(`/v1/admin/games?page=${page}&pageSize=${pageSize}`)
		.catch(e => nextError(e));
	return data.data;
};

export const getAGameSet = async (setId: string) => {
	const { data } = await queryClient()
		.get(`/v1/admin/games/${setId}`)
		.catch(e => nextError(e));
	return data.data;
};

type TFixture = {
	league: number;
	season?: string;
	startDate: string;
};

export const getFixtures = async (payload: TFixture) => {
	const { data } = await queryClient()
		.get(
			`/v1/admin/fixtures?league=${payload.league}&startDate=${payload.startDate}`
		)
		.catch(e => nextError(e));
	return data;
};

type TPredict = {
	setId: string;
	subscriberId?: string;
	status?: "PENDING" | "WIN" | "LOSE";
	msisdn?: string;
};

export const getPredictions = async (payload: TPredict) => {
	const { data } = await queryClient()
		.get(
			`/v1/admin/games/${payload.setId}/predictions?subscriberId=${payload.subscriberId}&status=${payload.status}&msisdn=${payload.msisdn}`
		)
		.catch(e => nextError(e));
	return data.data;
};

// admin/winners?status=PENDING

type TWinners = {
	page?: number;
	status?: string;
};

export const getWinners = async (payload: TWinners) => {
	const { data } = await queryClient()
		.get(`/v1/admin/winners?status=${payload.status}&page=${payload.page}`)
		.catch(e => nextError(e));
	return data.data;
};

type TPay = {
	winnerId: string;
	reward: string;
};

export const payWinner = async (payload: TPay) => {
	const { data } = await queryClient()
		.post(`/v1/admin/winners`, payload)
		.catch(e => nextError(e));
	return data;
};
