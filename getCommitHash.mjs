import { execSync } from 'child_process';

const getCommitHash = () => {
  return execSync('git rev-parse --short HEAD').toString().trim();
};

export default getCommitHash;