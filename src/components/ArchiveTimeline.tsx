import type { ArchiveYear, Program } from '../types';

interface ArchiveTimelineProps {
  selectedYear: ArchiveYear;
  onSelectYear: (year: ArchiveYear) => void;
  programs: Program[];
}

export function ArchiveTimeline({ selectedYear, onSelectYear, programs }: ArchiveTimelineProps) {
  const years: ArchiveYear[] = ['2000s', '2010s', '2020s', '2026'];

  return (
    <div className="timeline-panel panel">
      <div className="panel-header">
        <h3>Time Travel</h3>
      </div>

      <div className="year-grid">
        {years.map((year) => {
          const count = programs.filter((program) => program.archiveYear === year).length;
          const active = selectedYear === year;

          return (
            <button
              key={year}
              type="button"
              className={`year-chip ${active ? 'active' : ''}`}
              onClick={() => onSelectYear(year)}
            >
              <span>{year}</span>
              <em>{count} shows</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}
