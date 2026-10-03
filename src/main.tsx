import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { startAnalytics, tagVisit } from './lib/analytics.ts';
import { captureRef } from './lib/referral.ts';

// Before the first render, so the first view is counted.
startAnalytics();
// Which creator's link, if any: every event of this visit carries it.
const ref = captureRef();
if (ref) tagVisit({ ref });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
