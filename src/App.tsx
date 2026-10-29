import { useEffect, useMemo, useState } from 'react';
import { ArchiveTimeline } from './components/ArchiveTimeline';
import { ProgramGuide } from './components/ProgramGuide';
import { RecordingList } from './components/RecordingList';
import { FileUpload } from './components/FileUpload';
import { sampleChannels, samplePrograms } from './data/sampleData';
import { parseM3u8 } from './lib/m3u8';
import { loadRecordings, saveRecordings } from './lib/storage';
import { VideoPlayer } from './components/VideoPlayer';
import type { ArchiveYear, Channel, Program, Recording } from './types';

const archiveYears: ArchiveYear[] = ['2000s', '2010s', '2020s', '2026'];

function App() {
  const [channels, setChannels] = useState<Channel[]>(sampleChannels);
  const [selectedChannelId, setSelectedChannelId] = useState<string>(sampleChannels[0].id);
  const [selectedYear, setSelectedYear] = useState<ArchiveYear>('2010s');
  const [recordings, setRecordings] = useState<Recording[]>(() => loadRecordings());
  const [selectedProgramId, setSelectedProgramId] = useState<string>(samplePrograms[0].id);

  useEffect(() => {
    saveRecordings(recordings);
  }, [recordings]);

  const activeChannel = useMemo(
    () => channels.find((channel) => channel.id === selectedChannelId) ?? channels[0],
    [channels, selectedChannelId],
  );

  const filteredPrograms = useMemo(
    () => samplePrograms.filter((program) => {
      const matchesYear = program.archiveYear === selectedYear;
      const matchesChannel = program.channelId === selectedChannelId;
      return matchesYear && matchesChannel;
    }),
    [selectedChannelId, selectedYear],
  );

  const selectedProgram =
    samplePrograms.find((program) => program.id === selectedProgramId) ??
    filteredPrograms[0] ??
    samplePrograms[0];

  const handleImportM3u8 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const imported = parseM3u8(text);

    if (!imported.length) return;

    const mappedChannels: Channel[] = imported.map((entry, index) => ({
      id: entry.id || `imported-${index}`,
      name: entry.name,
      group: entry.groupTitle ?? 'Imported',
      category: entry.groupTitle ?? 'Imported',
      streamUrl: entry.url,
      logo: entry.tvgLogo ?? '/vite.svg',
      description: `Imported channel ${index + 1}`,
      archiveYears,
    }));

    setChannels((prev) => [...mappedChannels, ...prev]);
    setSelectedChannelId(mappedChannels[0].id);
    setSelectedYear('2020s');
    event.target.value = '';
  };

  const recordProgram = (program: Program) => {
    const recording: Recording = {
      id: `recording-${Date.now()}`,
      programId: program.id,
      channelId: program.channelId,
      title: program.title,
      streamUrl: program.streamUrl,
      recordedAt: new Date().toISOString(),
      status: 'ready',
      archiveYear: program.archiveYear,
    };

    setRecordings((prev) => [recording, ...prev]);
  };

  const deleteRecording = (recordingId: string) => {
    setRecordings((prev) => prev.filter((recording) => recording.id !== recordingId));
  };

  const watchRecording = (programId: string) => {
    const match = samplePrograms.find((program) => program.id === programId);
    if (!match) return;
    setSelectedChannelId(match.channelId);
    setSelectedYear(match.archiveYear);
    setSelectedProgramId(match.id);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">NBCUniversal-inspired demo</p>
          <h1>SYFY Cable Archives</h1>
        </div>

        <div className="topbar-actions">
          <FileUpload label="Import M3U8" accept=".m3u,.m3u8" onChange={handleImportM3u8} />
        </div>
      </header>

      <ArchiveTimeline selectedYear={selectedYear} onSelectYear={setSelectedYear} programs={samplePrograms} />

      <main className="content-grid">
        <section className="main-column">
          <div className="panel channel-strip">
            {channels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                className={`channel-pill ${selectedChannelId === channel.id ? 'active' : ''}`}
                onClick={() => setSelectedChannelId(channel.id)}
              >
                <span className="channel-badge">{channel.name}</span>
              </button>
            ))}
          </div>

          <VideoPlayer
            title={selectedProgram.title}
            poster={selectedProgram.thumbnail}
            src={selectedProgram.streamUrl}
            onRecord={() => recordProgram(selectedProgram)}
          />

          <div className="panel program-summary">
            <div>
              <p className="eyebrow">Now playing</p>
              <h2>{selectedProgram.title}</h2>
            </div>
            <div className="meta-inline">
              <span>{activeChannel?.name}</span>
              <span>{selectedProgram.genre}</span>
              <span>{selectedProgram.archiveYear}</span>
            </div>
            <p>{selectedProgram.description}</p>
          </div>

          <ProgramGuide
            title={`Full programming • ${selectedYear}`}
            programs={filteredPrograms}
            selectedProgramId={selectedProgram.id}
            onSelectProgram={(program) => {
              setSelectedProgramId(program.id);
              setSelectedChannelId(program.channelId);
            }}
            onRecordProgram={recordProgram}
          />
        </section>

        <aside className="sidebar-column">
          <div className="panel">
            <div className="panel-header">
              <h3>Channel line-up</h3>
            </div>
            <div className="channel-list">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  className={`channel-row ${selectedChannelId === channel.id ? 'active' : ''}`}
                  onClick={() => setSelectedChannelId(channel.id)}
                >
                  <div>
                    <strong>{channel.name}</strong>
                    <span>{channel.group}</span>
                  </div>
                  <small>{channel.archiveYears.join(', ')}</small>
                </button>
              ))}
            </div>
          </div>

          <RecordingList recordings={recordings} programs={samplePrograms} onWatch={watchRecording} onDelete={deleteRecording} />
        </aside>
      </main>
    </div>
  );
}

export default App;
