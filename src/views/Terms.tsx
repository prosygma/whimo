import React from 'react';
import LegalPage from '../components/legal/LegalPage.tsx';
import { TCU_SECTIONS, TCU_TITLE, TCU_VERSION } from '../content/tcu.ts';

const Terms: React.FC = () => (
  <LegalPage title={TCU_TITLE} version={TCU_VERSION} sections={TCU_SECTIONS} />
);

export default Terms;
