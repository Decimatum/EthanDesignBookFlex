// Loaded before every browser-mode component test so tokens, reset and utilities are live.
// Without it, computed-style assertions see browser defaults instead of the design system.
import './src/lib/styles/index.css';
