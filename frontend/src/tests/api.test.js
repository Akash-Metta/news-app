import { describe, it, expect } from 'vitest';
import { generateDynamicSignals } from '../services/api';

describe('Signal Data Engine Unit Tests', () => {
  
  it('should return exact match data for pre-baked topic "ai agents"', () => {
    const data = generateDynamicSignals('AI agents');
    expect(data).toBeDefined();
    expect(data.query).toBe('AI agents');
    expect(data.summary).toContain('Multi-agent execution frameworks');
    expect(data.key_takeaways.length).toBe(3);
    expect(data.results.length).toBe(5);
    expect(data.results[0].source).toBe('reddit');
  });

  it('should return dynamically generated signals for custom queries', () => {
    const data = generateDynamicSignals('Quantum Computing');
    expect(data).toBeDefined();
    expect(data.query).toBe('Quantum Computing');
    expect(data.summary).toContain('Quantum Computing');
    expect(data.results.length).toBe(5);
    expect(data.results[0].title).toContain('Quantum Computing');
  });

  it('should filter signals by source', () => {
    const data = generateDynamicSignals('Quantum Computing', ['reddit']);
    expect(data.results.every(item => item.source === 'reddit')).toBe(true);
  });

  it('should fall back to correct topics on keywords mapping', () => {
    const data = generateDynamicSignals('open-models');
    expect(data.query.toLowerCase()).toContain('open source llms');
  });

});
