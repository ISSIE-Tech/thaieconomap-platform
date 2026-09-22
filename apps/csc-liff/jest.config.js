module.exports = {
  testEnvironment: 'node',
  rootDir: 'src',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  transform: {
    // the app targets es5 (Next compiles it with SWC); ts-jest needs a modern
    // target or `class extends` a native class throws at runtime
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { target: 'es2020', esModuleInterop: true } }],
  },
};
