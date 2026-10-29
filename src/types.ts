export type ArchiveYear = '2000s' | '2010s' | '2020s' | '2026';

export interface Channel {
  id: string;
  name: string;
  group: string;
  category: string;
  streamUrl: string;
  logo: string;
  description: string;
  archiveYears: ArchiveYear[];
}

export interface Program {
  id: string;
  channelId: string;
  title: string;
  description: string;
  genre: string;
  start: string;
  end: string;
  year: number;
  archiveYear: ArchiveYear;
  streamUrl: string;
  thumbnail: string;
  episode?: string;
}

export interface Recording {
  id: string;
  programId: string;
  channelId: string;
  title: string;
  streamUrl: string;
  recordedAt: string;
  status: 'ready' | 'processing';
  archiveYear: ArchiveYear;
}
