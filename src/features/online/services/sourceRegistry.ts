import { MangaSourceAdapter } from './sources/base/MangaSourceAdapter';
import { MangaDexClient } from './sources/mangadex/mangadexClient';

export interface SourceConfig {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  client: MangaSourceAdapter;
}

export const sourceRegistry: SourceConfig[] = [
  {
    id: 'mangadex',
    name: 'MangaDex',
    enabled: true,
    priority: 1,
    client: new MangaDexClient(),
  },
];

export function getEnabledSources(): SourceConfig[] {
  return sourceRegistry
    .filter(source => source.enabled)
    .sort((a, b) => a.priority - b.priority);
}

export function getSourceById(sourceId: string): SourceConfig | undefined {
  return sourceRegistry.find(source => source.id === sourceId);
}

export function getAllSources(): SourceConfig[] {
  return [...sourceRegistry].sort((a, b) => a.priority - b.priority);
}

