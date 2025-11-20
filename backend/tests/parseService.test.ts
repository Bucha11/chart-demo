import { parseCsvBuffer, parseJsonBuffer } from '../src/services/parseService';

describe('parseCsvBuffer', () => {
  it('parses valid CSV', () => {
    const csv = 'category,amount\nA,10\nB,20\n';
    const rows = parseCsvBuffer(Buffer.from(csv, 'utf-8'));
    expect(rows).toHaveLength(2);
    expect(rows[0].category).toBe('A');
    expect(rows[0].amount).toBe(10);
  });

  it('throws on malformed CSV', () => {
    const malformed = '"unclosed\nline';
    expect(() => parseCsvBuffer(Buffer.from(malformed))).toThrow('Malformed CSV file');
  });
});

describe('parseJsonBuffer', () => {
  it('parses valid JSON array', () => {
    const json = JSON.stringify([{ category: 'A', amount: 10 }]);
    const rows = parseJsonBuffer(Buffer.from(json, 'utf-8'));
    expect(rows).toHaveLength(1);
    expect(rows[0].amount).toBe(10);
  });

  it('throws on malformed JSON', () => {
    const malformed = '{';
    expect(() => parseJsonBuffer(Buffer.from(malformed))).toThrow('Malformed JSON file');
  });

  it('throws when root is not array', () => {
    const obj = JSON.stringify({ foo: 'bar' });
    expect(() => parseJsonBuffer(Buffer.from(obj))).toThrow('JSON root should be an array');
  });
});
