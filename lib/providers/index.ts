import { ArxivProvider } from "./arxiv";
import { CrossrefProvider } from "./crossref";
import { OpenAlexProvider } from "./openalex";

export const providers = {
  arxiv: new ArxivProvider(),
  openalex: new OpenAlexProvider(),
  crossref: new CrossrefProvider(),
} as const;

export type ProviderKey = keyof typeof providers;
