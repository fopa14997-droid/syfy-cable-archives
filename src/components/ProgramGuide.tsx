import type { Program } from '../types';

interface ProgramGuideProps {
  title: string;
  programs: Program[];
  selectedProgramId?: string;
  onSelectProgram: (program: Program) => void;
  onRecordProgram: (program: Program) => void;
}

export function ProgramGuide({
  title,
  programs,
  selectedProgramId,
  onSelectProgram,
  onRecordProgram,
}: ProgramGuideProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
      </div>

      <div className="program-list">
        {programs.map((program) => {
          const isSelected = selectedProgramId === program.id;

          return (
            <div key={program.id} className={`program-card ${isSelected ? 'selected' : ''}`}>
              <img src={program.thumbnail} alt={program.title} />

              <div className="program-meta">
                <div className="program-topline">
                  <span>{program.genre}</span>
                  <span>{program.year}</span>
                </div>

                <h4>{program.title}</h4>
                <p>{program.description}</p>

                <div className="program-timing">
                  <span>{new Date(program.start).toLocaleDateString()}</span>
                  <span>
                    {new Date(program.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>

                <div className="program-actions">
                  <button type="button" className="secondary" onClick={() => onSelectProgram(program)}>
                    Watch now
                  </button>
                  <button type="button" className="primary" onClick={() => onRecordProgram(program)}>
                    Record
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
