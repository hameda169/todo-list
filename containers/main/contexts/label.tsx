import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AsyncRequest, LabelType } from '@/types';

const LabelContext = createContext<Array<LabelType> | undefined>(undefined);

export function LabelProvider({ children }: { children: React.ReactNode }) {
  const [labelsRequest, setLabelRequest] = useState<AsyncRequest<Array<LabelType>>>({ status: 'initial' });

  const loadLabels = useCallback(async () => {
    try {
      setLabelRequest({ status: 'loading', data: undefined, error: undefined });
      const labels: Array<LabelType> = await (await fetch('/api/label')).json();
      setLabelRequest({ status: 'success', data: labels, error: undefined });
    } catch (error) {
      setLabelRequest({ status: 'error', data: undefined, error: error as Error });
    }
  }, []);

  useEffect(() => {
    void loadLabels();
  }, [loadLabels]);

  return (
    <LabelContext.Provider value={labelsRequest.data}>
      {labelsRequest.status === 'loading' ? 'Loading labels ...' : null}
      {labelsRequest.status === 'success' ? children : null}
      {labelsRequest.status === 'error' ? (
        <div>
          Error while loading Labels: {labelsRequest.error.message}
          <div>
            <button onClick={loadLabels}>Try again</button>
          </div>
        </div>
      ) : null}
    </LabelContext.Provider>
  );
}

export function useLabels() {
  const labels = useContext(LabelContext);
  if (labels === undefined) {
    throw new Error('Labels should not be undefined');
  }
  return labels;
}
