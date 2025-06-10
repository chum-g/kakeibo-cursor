module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/lib/supabase$': '<rootDir>/src/lib/supabase.node.ts',
  },
}; 