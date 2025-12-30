import React from 'react';
import { createRoot } from 'react-dom/client';
import ContrastChecker from '../wcag-contrast-checker';

const root = createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><ContrastChecker /></React.StrictMode>);