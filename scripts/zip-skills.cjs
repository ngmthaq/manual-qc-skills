const fs = require('fs');
const path = require('path');
const { zip } = require('zip-a-folder');

const repoDir = path.join(__dirname, '..');
const srcDir = path.join(__dirname, '..', 'src');
const zipDir = path.join(__dirname, '..', 'zip');

function getSkillSources() {
  if (fs.existsSync(srcDir)) {
    return fs.readdirSync(srcDir)
      .filter((file) => fs.statSync(path.join(srcDir, file)).isDirectory())
      .map((folder) => ({
        name: folder,
        folderPath: path.join(srcDir, folder),
      }));
  }

  return fs.readdirSync(repoDir)
    .filter((file) => {
      return file.startsWith('mqcs-') && fs.statSync(path.join(repoDir, file)).isDirectory();
    })
    .map((folder) => ({
      name: folder,
      folderPath: path.join(repoDir, folder),
    }));
}

async function main() {
  await fs.promises.mkdir(zipDir, { recursive: true });

  const skillSources = getSkillSources();

  if (skillSources.length === 0) {
    throw new Error('No skill folders found in src/ or repository root.');
  }

  const expectedZipFiles = new Set(skillSources.map(({ name }) => `${name}.zip`));
  const existingZipFiles = fs
    .readdirSync(zipDir)
    .filter((file) => file.endsWith('.zip'));

  await Promise.all(
    existingZipFiles
      .filter((file) => !expectedZipFiles.has(file))
      .map(async (file) => {
        const staleZipPath = path.join(zipDir, file);
        await fs.promises.rm(staleZipPath);
        console.log(`Removed stale zip ${staleZipPath}`);
      })
  );
  await Promise.all(
    skillSources.map(async ({ name, folderPath }) => {
      const zipPath = path.join(zipDir, `${name}.zip`);
      await zip(folderPath, zipPath);
      console.log(`Successfully zipped ${name} to ${zipPath}`);
    })
  );
}

main().catch((error) => {
  console.error('Error zipping skills:', error);
  process.exitCode = 1;
});
