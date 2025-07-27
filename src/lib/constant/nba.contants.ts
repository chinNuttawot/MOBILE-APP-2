import { Competition, Round } from '@component/Card/Board';

export interface HomePageApiResponse {
  players: Players;
  currentGame?: Games;
  nextGame?: Games;
  record: Record[];
}

export interface MyfavoritePageApiResponse {
  rowCount?: number;
  rows: FavoriteResult[];
  rowAsArray: boolean;
  oid: string;
  fields: Object;
  command: string;
  _types: object;
  _prebuiltEmptyResultObject: Object;
  _parsers: Object;
  RowCtor: string;
}

export interface TotalHistoryResponse {
  totals: string;
  rawRecord: RawRecord[];
  recordLasts: RawRecord[];
}

export interface RawRecord {
  rounds: string[];
  totalPriceByRound: number;
}

export interface Players {
  result: PlayerResult[];
}

export interface PlayerResult {
  Key: string;
  City: string;
  Name: string;
  Active: boolean;
  TeamID: number;
  Division?: string;
  LeagueID: number;
  HeadCoach?: string;
  StadiumID?: number;
  Conference?: string;
  GlobalTeamID: number;
  PrimaryColor?: string;
  TertiaryColor?: string;
  SecondaryColor?: string;
  NbaDotComTeamID: number;
  QuaternaryColor?: string;
  WikipediaLogoUrl?: string;
  WikipediaWordMarkUrl: any;
  isFavorite: boolean;
}

export interface FavoriteResult {
  created_at: string;
  id: number;
  team_id: number;
  user_id: number;
}

export interface Standings {
  result: StandingResult[];
}

export type historyListTeamResult = {
  type: number;
  teamId: string;
};

export interface StandingResult {
  Key: string;
  City: string;
  Name: string;
  Wins: number;
  Losses: number;
  Season: number;
  Streak: number;
  TeamID: number;
  AwayWins: number;
  Division: string;
  HomeWins: number;
  GamesBack: number;
  AwayLosses: number;
  Conference: string;
  HomeLosses: number;
  Percentage: number;
  SeasonType: number;
  LastTenWins: number;
  DivisionRank: number;
  DivisionWins: number;
  GlobalTeamID: number;
  LastTenLosses: number;
  ConferenceRank: number;
  ConferenceWins: number;
  DivisionLosses: number;
  ConferenceLosses: number;
  PointsPerGameFor: number;
  StreakDescription: string;
  PointsPerGameAgainst: number;
}

export interface Schedule {
  result: ScheduleResult[];
}

export interface ScheduleResult {
  Day: string;
  GameID: number;
  Season: number;
  Status: string;
  Channel: string;
  Quarter: any;
  Updated: string;
  AwayTeam: string;
  DateTime: string;
  HomeTeam: string;
  IsClosed: boolean;
  LastPlay: string;
  Quarters: any[];
  UmpireID?: number;
  OverUnder?: number;
  RefereeID?: number;
  StadiumID: number;
  Attendance?: number;
  AwayTeamID: number;
  HomeTeamID: number;
  OverPayout?: number;
  SeasonType: number;
  SeriesInfo: any;
  AlternateID: any;
  CrewChiefID?: number;
  DateTimeUTC: string;
  PointSpread?: number;
  UnderPayout?: number;
  GlobalGameID: number;
  NeutralVenue: boolean;
  AwayTeamScore?: number;
  HomeTeamScore?: number;
  GameEndDateTime?: string;
  GlobalAwayTeamID: number;
  GlobalHomeTeamID: number;
  AwayTeamMoneyLine?: number;
  HomeTeamMoneyLine?: number;
  AwayRotationNumber?: number;
  HomeRotationNumber?: number;
  InseasonTournament: boolean;
  TimeRemainingMinutes: any;
  TimeRemainingSeconds: any;
  PointSpreadAwayTeamMoneyLine?: number;
  PointSpreadHomeTeamMoneyLine?: number;
}

export interface Games {
  result: GameResult[];
}

export interface GameResult {
  Day: string;
  GameID: number;
  Season: number;
  Status: string;
  Channel: string;
  Quarter: any;
  Updated: string;
  AwayTeam: string;
  DateTime: string;
  HomeTeam: string;
  IsClosed: boolean;
  LastPlay: string;
  Quarters: any[];
  UmpireID: number;
  OverUnder: number;
  RefereeID: number;
  StadiumID: number;
  Attendance: any;
  AwayTeamID: number;
  HomeTeamID: number;
  OverPayout: number;
  SeasonType: number;
  SeriesInfo: any;
  AlternateID: any;
  CrewChiefID: number;
  DateTimeUTC: string;
  PointSpread: number;
  UnderPayout: number;
  GlobalGameID: number;
  NeutralVenue: boolean;
  AwayTeamScore: any;
  HomeTeamScore: any;
  GameEndDateTime: any;
  GlobalAwayTeamID: number;
  GlobalHomeTeamID: number;
  AwayTeamMoneyLine: number;
  HomeTeamMoneyLine: number;
  AwayRotationNumber: number;
  HomeRotationNumber: number;
  InseasonTournament: boolean;
  TimeRemainingMinutes: any;
  TimeRemainingSeconds: any;
  PointSpreadAwayTeamMoneyLine: number;
  PointSpreadHomeTeamMoneyLine: number;
  currentTeam?: string;
  defeatTeam?: string;
}
export interface Record {
  record_type: string;
  id: number;
  user_id: number;
  name: string;
  record_data: RecordData;
  random: Random;
  status: string;
  created_at: string;
}

export interface RecordData {
  id: number;
  competitions: Competition[];
  rounds: Round[];
  currentTeam: string;
  defeatTeam: string;
  currentTeamLogo: string;
  defeatTeamLogo: string;
}

export interface Random {
  random: string[];
}
