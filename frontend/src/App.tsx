import React from 'react';
import { useDataAnalysis } from './hooks/useDataAnalysis';
import UploadArea from './components/UploadArea';
import ChartsPanel from './components/ChartsPanel';
import FiltersPanel from './components/FiltersPanel';
import DataTable from './components/DataTable';
import HistoryTable from './components/HistoryTable';

export default function App() {
  const { analysis, rawPreview, loading, error, history, uploadFile, fetchHistory } = useDataAnalysis();

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const [filtered, setFiltered] = React.useState<any[]>(rawPreview);

  React.useEffect(() => {
    // reset filtered when new preview arrives
    setFiltered(rawPreview);
  }, [rawPreview]);

  return (
    <div className="app">
      <header>
        <h1>Data Processing Dashboard</h1>
      </header>

      <main>
        <section className="upload">
          <UploadArea onFileSelected={uploadFile} />
          {loading && <div className="loading">Processing...</div>}
          {error && <div className="error">{error}</div>}
        </section>

        {analysis && (
          <>
            <section className="filters">
              <FiltersPanel
                raw={rawPreview}
                onChange={(rows) => setFiltered(rows)}
              />
            </section>

            <section className="charts">
              <ChartsPanel analysis={analysis} data={filtered} />
            </section>

            <section className="table">
              <DataTable data={filtered} />
            </section>
          </>
        )}

        <section className="history">
          <h2>Upload history</h2>
          <HistoryTable items={history} />
        </section>
      </main>
    </div>
  );
}
