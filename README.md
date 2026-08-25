<p align="center">
  <img alt="Gummisaurus" src="src/assets/branding/gummisaurus-banner-light.svg" width="720">
</p>

# Gummisaurus

Gummisaurus is an independent, open source media client for Amazon Vega OS. It
connects to servers running [Jellyfin](https://jellyfin.org/) and is maintained
by Tallest Giant LLC.

This project is not affiliated with or endorsed by Jellyfin, Inc. or Amazon.
Jellyfin is a trademark of Jellyfin, Inc. Gummisaurus uses its own name and
visual identity in accordance with the Jellyfin branding policy.

## Status

Gummisaurus is in initial development and is not ready for general use. The
first milestone is a testable VPKG for Vega OS 1.2 based on Vega SDK 0.24.

## Architecture

The project forks `jellyfin-web` and packages its TV interface inside a native
React Native for Vega shell. This keeps broad Jellyfin server compatibility and
an upstream merge path while using Vega's WebView, hardware media stack, remote
input, and system media controls.

The inherited web client already includes TV navigation, Vega user-agent
detection, HLS playback, trickplay, media-segment actions for intros and
credits, and next-episode autoplay. Native Vega playback will replace WebView
playback only where device testing shows a concrete compatibility or
performance need.

## Repository Layout

- `src/`: the GPL-licensed web client fork
- `vega/`: the Vega SDK 0.24 application shell
- `webpack.vega.js`: builds the web client directly into the Vega package

## Build

Requirements:

- Node.js 24 and npm 11 for the web client
- Node.js 22 or newer for the Vega shell
- Vega SDK 0.24

Amazon supports the Vega tools on macOS 10.15+ and Ubuntu 20.04+. A pinned
Ubuntu builder is available at `vega/docker/release.Dockerfile` for release
automation on non-Ubuntu hosts. The resulting image contains Amazon's
proprietary SDK and must not be published.

```sh
npm ci
npm --prefix vega ci
npm run build:vega:debug
```

The VPKG is written under `vega/build/`. A release package requires a clean Git
worktree, an explicit version matching `vega/package.json` and
`vega/manifest.toml`, and an increasing positive build number:

```sh
BUILD_VERSION=0.1.0 BUILD_NUMBER=1 npm run build:vega:release
```

The release command builds and validates `armv7`, `aarch64`, and `x86_64`
packages with Vega Packaging Tool. It also writes a SHA-384 checksum manifest
and a JSON release record containing the source commit, SDK version, package
identity, version, build number, architectures, sizes, and checksums.

For Amazon Appstore submission, upload the generated package at:

```text
vega/build/armv7-release/gummisaurus-vega_armv7.vpkg
```

Amazon's [Vega 0.24 submission guide](https://developer.amazon.com/docs/vega/0.24/app-submission)
identifies the `armv7-release` VPKG as the Fire TV submission binary. The app
manifest already registers the required `com.amazon.category.main` category.
Before submission:

- Test the release VPKG on a physical Vega OS device.
- Complete Amazon's user-data privacy questionnaire and provide a privacy
  policy URL when required by the app's data practices.
- Prepare the display title, short and long descriptions, three to five feature
  bullets, pricing, release notes, and optional search keywords.
- Prepare 114 x 114px and 512 x 512px transparent PNG icons.
- Prepare a 1280 x 720px opaque PNG Fire TV app icon.
- Prepare three to ten 1920 x 1080px Fire TV screenshots as JPG or opaque
  24-bit PNG files, with no personal account information visible.
- Prepare a 1920 x 1080px opaque JPG or 24-bit PNG Fire TV background image.
- In the Developer Console, target the appropriate device in **Amazon Fire
  TV** > **Amazon Vega TV**, and do not mention "Vega" in any submission field.
- Complete the content-policy, intellectual-property, device-targeting, and
  final review checks before selecting **Submit App**.

## Compatibility Priorities

- User-supplied local HTTP and remote HTTPS servers
- Password and Quick Connect authentication
- Movie, television, music, and live TV libraries
- Direct play with reliable transcoding fallback
- Audio tracks, subtitles, trickplay, intro and credit segments
- Server-supplied pre-rolls and next-episode autoplay
- Optional media-request and access-gateway integrations

## Upstream

The `upstream` remote tracks
[`jellyfin/jellyfin-web`](https://github.com/jellyfin/jellyfin-web). Changes that
benefit the wider Jellyfin ecosystem should be kept suitable for upstreaming
where practical.

## License

Gummisaurus is distributed under the GNU General Public License version 2 or,
at your option, any later version. Existing Jellyfin copyright and attribution
notices remain intact. See [LICENSE](LICENSE).
