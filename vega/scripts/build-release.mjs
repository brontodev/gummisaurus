#!/usr/bin/env node

import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, join, relative, resolve, sep} from 'node:path';

const vegaDirectory = resolve(process.cwd());
const repositoryDirectory = resolve(vegaDirectory, '..');
const buildDirectory = join(vegaDirectory, 'build');
const architectures = ['armv7', 'aarch64', 'x86_64'];
const expectedSdkVersion = 'main@0.24.9914';
const expectedVegaCliVersion = '1.3.4';
const buildVersion = process.env.BUILD_VERSION;
const buildNumber = process.env.BUILD_NUMBER;
const packageJson = JSON.parse(
  readFileSync(join(vegaDirectory, 'package.json'), 'utf8'),
);
const manifest = readFileSync(join(vegaDirectory, 'manifest.toml'), 'utf8');

function fail(message) {
  throw new Error(message);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: vegaDirectory,
    stdio: 'inherit',
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    fail(`${command} exited with status ${result.status}`);
  }
}

function capture(command, args, cwd = vegaDirectory) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
  }).trim();
}

function packageManifestValue(key) {
  const packageSection = manifest.match(
    /^\[package\]\s*$([\s\S]*?)(?=^\[|(?![\s\S]))/m,
  )?.[1];
  const value = packageSection?.match(
    new RegExp(`^${key}\\s*=\\s*"([^"]+)"\\s*$`, 'm'),
  )?.[1];

  if (!value) {
    fail(`Missing package.${key} in manifest.toml`);
  }

  return value;
}

function portablePath(path) {
  return relative(repositoryDirectory, path).split(sep).join('/');
}

if (
  !buildVersion ||
  !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(buildVersion)
) {
  fail('BUILD_VERSION must be a semantic version such as 0.1.0');
}

if (!buildNumber || !/^[1-9]\d*$/.test(buildNumber)) {
  fail('BUILD_NUMBER must be a positive integer');
}

const numericBuildNumber = Number(buildNumber);

if (!Number.isSafeInteger(numericBuildNumber)) {
  fail('BUILD_NUMBER must be a safe integer');
}

const manifestVersion = packageManifestValue('version');
const packageId = packageManifestValue('id');

if (packageJson.version !== buildVersion || manifestVersion !== buildVersion) {
  fail(
    `BUILD_VERSION ${buildVersion} must match vega/package.json and ` +
      `vega/manifest.toml (${packageJson.version}, ${manifestVersion})`,
  );
}

const worktreeStatus = capture(
  'git',
  ['status', '--porcelain', '--untracked-files=normal'],
  repositoryDirectory,
);

if (worktreeStatus) {
  fail('Release builds require a clean Git worktree');
}

const commit = capture('git', ['rev-parse', 'HEAD'], repositoryDirectory);
const sdk = JSON.parse(capture('vega', ['--version', '--json']));

if (
  sdk.sdkVersion !== expectedSdkVersion ||
  sdk.vegaCLIVersion !== expectedVegaCliVersion
) {
  fail(
    `Expected Vega SDK ${expectedSdkVersion} and CLI ${expectedVegaCliVersion}, ` +
      `found ${sdk.sdkVersion} and ${sdk.vegaCLIVersion}`,
  );
}

run('react-native', [
  'build-vega',
  '--build-type',
  'Release',
  '--build-version',
  buildVersion,
  '--build-number',
  buildNumber,
]);

const packages = architectures.map((architecture) => {
  const path = join(
    buildDirectory,
    `${architecture}-release`,
    `${packageJson.name}_${architecture}.vpkg`,
  );

  if (!existsSync(path)) {
    fail(`Missing ${architecture} release package: ${path}`);
  }

  run('vega', ['exec', 'vpt', 'validate', path]);

  const info = JSON.parse(
    capture('vega', ['exec', 'vpt', 'info', '--json', path]),
  );

  if (info.id !== packageId) {
    fail(`${path} has package id ${info.id}, expected ${packageId}`);
  }

  if (info.version !== buildVersion) {
    fail(`${path} has version ${info.version}, expected ${buildVersion}`);
  }

  if (Number(info.build_number) !== numericBuildNumber) {
    fail(
      `${path} has build number ${info.build_number}, expected ${buildNumber}`,
    );
  }

  const checksumOutput = capture('vega', ['exec', 'vpt', 'checksum', path]);
  const sha384 = checksumOutput.match(/^sha384:\s*([0-9a-f]{96})$/i)?.[1];

  if (!sha384) {
    fail(`Could not parse VPT checksum for ${path}: ${checksumOutput}`);
  }

  return {
    architecture,
    file: portablePath(path),
    sha384,
    size: info.size,
  };
});

const releaseName = `gummisaurus-${buildVersion}+${buildNumber}`;
const checksumsPath = join(buildDirectory, `${releaseName}-SHA384SUMS`);
const recordPath = join(buildDirectory, `${releaseName}-release.json`);

writeFileSync(
  checksumsPath,
  `${packages
    .map(({file, sha384}) => `${sha384}  ${basename(file)}`)
    .join('\n')}\n`,
);
writeFileSync(
  recordPath,
  `${JSON.stringify(
    {
      schemaVersion: 1,
      commit,
      packageId,
      version: buildVersion,
      buildNumber: numericBuildNumber,
      sdkVersion: sdk.sdkVersion,
      vegaCliVersion: sdk.vegaCLIVersion,
      packages,
    },
    null,
    2,
  )}\n`,
);

console.log('\nRelease packages validated:');
for (const packageRecord of packages) {
  const storeMarker =
    packageRecord.architecture === 'armv7' ? ' (Amazon Appstore upload)' : '';
  console.log(`- ${packageRecord.file}${storeMarker}`);
}
console.log(`- ${portablePath(checksumsPath)}`);
console.log(`- ${portablePath(recordPath)}`);
