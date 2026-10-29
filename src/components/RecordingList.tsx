import type { Program, Recording } from '../types';

interface RecordingListProps {
  recordings: Recording[];
  programs: Program[];
  onWatch: (programId: string) => void;
  onDelete: (recordingId: string) => void;
}

export function RecordingList({ recordings, programs, onWatch, onDelete }: RecordingListProps) {
  const lookup = new Map(programs.map((program) => [program.id, program]));

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Recordings & Downloads</h3>
      </div>

      {recordings.length === 0 ? (
        <div className="message-box">No recordings yet. Choose a program and click “Record program”.</div>
      ) : (
        <div className="recordings-list">
          {recordings.map((recording) => {
            const program = lookup.get(recording.programId);

            return (
              <div key={recording.id} className="recording-item">
                <div>
                  <strong>{recording.title}</strong>
                  <div>{recording.archiveYear}</div>
                  <div>{new Date(recording.recordedAt).toLocaleString()}</div>
                </div>

                <div className="recording-actions">
                  <button type="button" className="secondary" onClick={() => onWatch(recording.programId)}>
                    Watch
                  </button>
                  <a href={recording.streamUrl} target="_blank" rel="noreferrer" className="download-link">
                    Download
                  </a>
                  <button type="button" className="ghost" onClick={() => onDelete(recording.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
