export interface ParsingVacancy {
  title: string;
  location: string;
  description: string;
}

export interface Parser {
  parsingVacancy: (vacancyURL: string) => Promise<ParsingVacancy>;
}
