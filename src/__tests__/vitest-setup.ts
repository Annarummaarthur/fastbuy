import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
});
