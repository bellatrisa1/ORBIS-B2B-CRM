// Мок для 'server-only' — Vitest о нём не знает
import { vi } from 'vitest';
vi.mock('server-only', () => ({}));