import { OnlineManga, OnlineChapter } from '../../../types';
import { MANGADEX_UPLOADS_BASE } from './constants';

export function parseMangaData(mangaData: any): OnlineManga {
  const attributes = mangaData.attributes;
  const coverRelation = mangaData.relationships?.find(
    (rel: any) => rel.type === 'cover_art'
  );
  const authorRelation = mangaData.relationships?.find(
    (rel: any) => rel.type === 'author'
  );

  let coverUrl: string | undefined;
  if (coverRelation?.attributes?.fileName) {
    coverUrl = `${MANGADEX_UPLOADS_BASE}/covers/${mangaData.id}/${coverRelation.attributes.fileName}`;
  }

  return {
    id: mangaData.id,
    title: attributes.title.en || Object.values(attributes.title)[0] as string,
    coverUrl,
    description: attributes.description?.en,
    author: authorRelation?.attributes?.name,
    status: attributes.status,
    sourceType: 'mangadex',
    sourceId: mangaData.id,
  };
}

export function parseChapterData(chapterData: any): OnlineChapter {
  const attributes = chapterData.attributes;
  const groupRelation = chapterData.relationships?.find(
    (rel: any) => rel.type === 'scanlation_group'
  );

  return {
    id: chapterData.id,
    mangaId: chapterData.relationships.find((rel: any) => rel.type === 'manga')?.id || '',
    chapterNumber: attributes.chapter || '0',
    title: attributes.title,
    volume: attributes.volume,
    pages: attributes.pages || 0,
    publishDate: new Date(attributes.publishAt),
    scanlationGroup: groupRelation?.attributes?.name,
    sourceType: 'mangadex',
  };
}

