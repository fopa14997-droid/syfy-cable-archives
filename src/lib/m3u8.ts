export interface ParsedM3u8Channel {
  id: string;
  name: string;
  groupTitle?: string;
  tvgLogo?: string;
  url: string;
}

const extractValue = (line: string, key: string): string | undefined => {
  const match = new RegExp(`${key}="([^"]+)"`, 'i').exec(line);
  return match ? match[1] : undefined;
};

const parseExtInf = (line: string) => {
  const titleMatch = /,(.*)$/.exec(line);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled channel';

  return {
    title,
    groupTitle: extractValue(line, 'group-title'),
    tvgId: extractValue(line, 'tvg-id'),
    tvgLogo: extractValue(line, 'tvg-logo'),
  };
};

export function parseM3u8(content: string): ParsedM3u8Channel[] {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  const channels: ParsedM3u8Channel[] = [];

  let current: Partial<ParsedM3u8Channel> & { name?: string; groupTitle?: string } = {};

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith('#EXTINF')) {
      const { title, groupTitle, tvgLogo } = parseExtInf(line);
      current = {
        ...current,
        name: title,
        groupTitle,
        tvgLogo,
      };
      continue;
    }

    if (line.startsWith('#EXTGRP')) {
      current.groupTitle = line.replace('#EXTGRP:', '').trim();
      continue;
    }

    if (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('rtmp://') || line.startsWith('udp://')) {
      const entry: ParsedM3u8Channel = {
        id: `${current.name ?? 'channel'}-${current.url ?? line}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: current.name ?? 'Imported channel',
        groupTitle: current.groupTitle,
        tvgLogo: current.tvgLogo,
        url: line,
      };

      channels.push(entry);
      current = {};
    }
  }

  return channels.filter((channel) => channel.name && channel.url);
}
