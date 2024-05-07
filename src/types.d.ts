import { type } from "os";

export type TUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  businessName?: string;
  businessNature?: string;
  businessService?: string;
  companyEmail?: string;
  email: string;
  legalBusinessName?: string;
  phone?: string;
  role: EUserRoles;
  address?: string;
  city?: string;
  state?: string;
  planId?: string;
  accountType?: string;
  isVerified?: boolean;
  lastLogin?: Date;
};

export type TAdmin = {
  id: string;
  username: string;
  roles: [
    {
      authority: string;
    }
  ];
};

export type AppData = {
  user: TAdmin;
  token: string;
  isLoggedIn?: boolean;
};

export type League = {
  id: string;
  providerId: string;
  name: string;
  type: string;
  country: string;
  logo: string;
  dateAdded: string;
};

export type Team = {
  id: string;
  providerId: string;
  name: string;
  code: string;
  country: string;
  founded: number;
  nationalTeam: boolean;
  score: null;
  logo: string;
  dateAdded: string;
};

export type TSubscriber = {
	id: string;
	msisdn: string;
	pin: string;
	predictionPoints: number;
	dateAdded: string;
	lastLogin: null;
	lastSubscription: string;
	enabled: boolean;
	password: string;
	username: string;
	authorities: [
		{
			authority: string;
		}
	];
	accountNonExpired: boolean;
	accountNonLocked: boolean;
	credentialsNonExpired: boolean;
};

export type TSubscribersData = {
	total: string;
	pages: string;
	subscribers: TSubscriber[];
	pageSize: string;
	currentPage: string;
};

export type TGameSetSingle = {
	id: string;
	league: {
		id: string;
		logo: string;
		name: string;
	};
	stadium: string;
	round: string;
	gameDate: string;
	time: string;
	home: {
		id: string;
		providerId: string;
		name: string;
		code: string;
		country: string;
		founded: number;
		nationalTeam: boolean;
		score: string;
		logo: string;
		dateAdded: string;
	};
	away: {
		id: string;
		providerId: string;
		name: string;
		code: string;
		country: string;
		founded: number;
		nationalTeam: boolean;
		score: string;
		logo: string;
		dateAdded: string;
	};
	predictions: null | string;
};

export type TGameSet = {
	id: string;
	gameDate: string;
	expires: string;
	expired: boolean;
	addedBy: null | string;
	resultDecided: boolean;
	games: TGameSetSingle[];
};

export type TGameSetGroup = {
	currentPage: number;
	totalRecords: number;
	totalPages: number;
	pageSize: number;
	gameSets: [
		{
			id: string;
			gameDate: string;
			expires: string;
			expired: boolean;
			addedBy: string | null;
			resultDecided: boolean;
            games: TGameSet[]
;		}
	];
};

export type TFixturesInterface = {
	total: number;
	pages: number;
	pageSize: number;
	currentPage: number;
    fixtures: TFixture[];
};

export type TFixture = {
	id: string | null;
	setId: string | null;
	thirdPartyId: string;
	league: {
		id: null;
		providerId: string;
		name: string;
		type: null;
		country: string;
		logo: string;
		flag: string;
		dateAdded: string;
	};
	season: string;
	round: string;
	stadium: string;
	home: {
		id: null;
		providerId: string;
		name: string;
		code: string;
		country: string;
		founded: number;
		nationalTeam: boolean;
		score: string;
		logo: string;
		dateAdded: string;
	};
	away: {
		id: null;
		providerId: string;
		name: string;
		code: string;
		country: string;
		founded: number;
		nationalTeam: boolean;
		score: string;
		logo: string;
		dateAdded: string;
	};
	date: string;
	time: string;
	statusText: string;
	status: string;
};

export type TPredictionGroup = {
	total: string;
	pages: string;
	pageSize: string;
	currentPage: string;
    predictions: TPrediction[];
};

export type TPrediction = {
	id: string;
	userId: string;
	setId: string;
	status: "PENDING" | "WIN" | "LOSE";
	predictions: [
		{
			fixtureId: string;
			home: string;
			away: string;
		}
	];
	dateAdded: string;
	timestamp: string;
};

export type TPredictionSolo = {
    id: string;
    home: string;
    away: string;
}

export type TWinner = {
	id: string;
	subscriber: {
		id: string;
		msisdn: string;
		name: string;
		email: string;
	};
	gameSetId: string;
	predictionId: string;
	paymentStatus: "PENDING | PAID";
	position: null | string;
	reward: string;
	createdAt: string;
};

export type TWinnersGroup = {
    winners: TWinner[];
	total: string;
	pages: string;
	pageSize: string;
	currentPage: string;
};