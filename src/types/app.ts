export type Difficulty = "easy" | "medium" | "hard";
export type DifficultyFilter = "all" | Difficulty;

export type RouteCard = {
  id: string;
  difficulty: Difficulty;
  imageClass: string;
  sceneIcon: string;
  sceneTitle: string;
  title: string;
  badgeLabel: string;
  location: string;
  distance: string;
  duration: string;
  progress: number;
  description: string;
};

export type WeatherCard = {
  location: string;
  icon: string;
  temp: string;
  description: string;
  humidity: string;
  wind: string;
  visibility: string;
  statusLabel: string;
  statusClass: "status--good" | "status--ok" | "status--bad";
};

export type Companion = {
  name: string;
  route: string;
  tags: string[];
};
