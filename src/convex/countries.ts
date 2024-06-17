import { action, query } from "./_generated/server";

interface Country {
  name: Name;
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: Currencies;
  idd: Idd;
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  languages: Languages;
  translations: Translations;
  latlng: number[];
  landlocked: boolean;
  area: number;
  demonyms: Demonyms;
  flag: string;
  maps: Maps;
  population: number;
  car: Car;
  timezones: string[];
  continents: string[];
  flags: Flags;
  coatOfArms: CoatOfArms;
  startOfWeek: string;
  capitalInfo: CapitalInfo;
  postalCode: PostalCode;
}

interface Name {
  common: string;
  official: string;
  nativeName: NativeName;
}

interface NativeName {
  fra: Fra;
}

interface Fra {
  official: string;
  common: string;
}

interface Currencies {
  XPF: Xpf;
}

interface Xpf {
  name: string;
  symbol: string;
}

interface Idd {
  root: string;
  suffixes: string[];
}

interface Languages {
  fra: string;
}

interface Translations {
  ara: Ara;
  bre: Bre;
  ces: Ces;
  cym: Cym;
  deu: Deu;
  est: Est;
  fin: Fin;
  fra: Fra2;
  hrv: Hrv;
  hun: Hun;
  ita: Ita;
  jpn: Jpn;
  kor: Kor;
  nld: Nld;
  per: Per;
  pol: Pol;
  por: Por;
  rus: Rus;
  slk: Slk;
  spa: Spa;
  srp: Srp;
  swe: Swe;
  tur: Tur;
  urd: Urd;
  zho: Zho;
}

interface Ara {
  official: string;
  common: string;
}

interface Bre {
  official: string;
  common: string;
}

interface Ces {
  official: string;
  common: string;
}

interface Cym {
  official: string;
  common: string;
}

interface Deu {
  official: string;
  common: string;
}

interface Est {
  official: string;
  common: string;
}

interface Fin {
  official: string;
  common: string;
}

interface Fra2 {
  official: string;
  common: string;
}

interface Hrv {
  official: string;
  common: string;
}

interface Hun {
  official: string;
  common: string;
}

interface Ita {
  official: string;
  common: string;
}

interface Jpn {
  official: string;
  common: string;
}

interface Kor {
  official: string;
  common: string;
}

interface Nld {
  official: string;
  common: string;
}

interface Per {
  official: string;
  common: string;
}

interface Pol {
  official: string;
  common: string;
}

interface Por {
  official: string;
  common: string;
}

interface Rus {
  official: string;
  common: string;
}

interface Slk {
  official: string;
  common: string;
}

interface Spa {
  official: string;
  common: string;
}

interface Srp {
  official: string;
  common: string;
}

interface Swe {
  official: string;
  common: string;
}

interface Tur {
  official: string;
  common: string;
}

interface Urd {
  official: string;
  common: string;
}

interface Zho {
  official: string;
  common: string;
}

interface Demonyms {
  eng: Eng;
}

interface Eng {
  f: string;
  m: string;
}

interface Maps {
  googleMaps: string;
  openStreetMaps: string;
}

interface Car {
  signs: string[];
  side: string;
}

interface Flags {
  png: string;
  svg: string;
}

interface CoatOfArms { }

interface CapitalInfo {
  latlng: number[];
}

interface PostalCode {
  format: string;
  regex: string;
}

export const list = action({
  handler: async () => {
    return fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((countries: Country[]) =>
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common)),
      );
  },
});
