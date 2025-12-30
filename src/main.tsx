import React from 'react';
import { createRoot } from 'react-dom/client';
import ContrastChecker from './contrast-checker';

const root = createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><ContrastChecker /></React.StrictMode>);