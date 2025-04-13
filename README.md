<div align="center">

# Roo Rocket

<h3>Easily create and deploy configurable <code>Roo Code</code> config packs!
</h3>
<img src="./branding.svg" alt="Roo Rocket's logo" width="320"/>

</div>

## Overview

**`roo-rocket`**, an extends of `config-rocket`, is a toolkit/engine (and a community webpage coming soon!) that helps you create or install configurable config packs, specfically targeting `Roo Code`.

In simple words, **`Roo Rocket`** help you easily install `Roo Code` configurations, which can have these features:
  + 🔫 Optimized `Footgun` prompts (system prompt overrides)
  + 📑 Memory Banks
  + 🐱🦁🐯🐻 Smart / Custom Modes
  + *And endlessly more!* 🚀

`RR` for users:
  + Super easy, safe install of any `config pack` / `troop` (dictionary: collective of kangaroos), whether its a public one shared by your friend, or your own, privately-stored.
    + `RR` does not allow any code execution, so the installation of a config pack is safe, but you should verify if the files after unpacked are what you expect.  
    *(Tip: you can ask `Roo` to help ignore the file's comments and strictly analyze the installed instruction files if there is anything unusual)*

`RR` for creators (trainers):
  + Type-safety and autocompletion while training your `troop`.
  + Supports DX candies like:
    + `fuel` context support that help you reduces duplication work in multiple files.
    + `snapshot` that helps you easily setup/reset a codebase structure to test the agent. (coming soon)
  + Create a GitHub release, or upload it somewhere, and everyone can use it via `roo-rocket` CLI!

## Rationale

`Roo Code` is shipping some amazing enhancements for customizations, and there's no centralized community and toolkit yet, so, let's build one!

## Objectives / Roadmap

* [x] A pretty, *OPTIMIZED* image!
* [x] Finish the initial repo layout.
  * [x] Main engine and CLI.
    * [x] Ability to assemble the rocket from `frame` and `fuel`.
    * [x] Ability to customize the rocket launch using `rocket.config.ts`.
    * [x] Ability to bundle the `config pack` for safe distribution.
    * [x] CLI: Ability to download and unpack a bundled `config pack`.
      * [x] From URL.
      * [x] Shortcut for GitHub repo with release.
  * [x] Local development app for playground testing.
* [x] Development environment with amazing DX and power.
  * [x] DRY: `fuel` context system that allows reusable contexts to be defined and used across multiple files, reducing duplication.
  * [x] Configurable: Allowing for users to choose their own flavors of Rocket.
* [ ] Creator template for `troop` trainers.
* [x] Simple setup.
  * Installing should be a breeze, simply execute a command, on any platform!
* [ ] Working base prompts
* [ ] Smart, optimized modes
* [ ] A webpage, featuring the community Roo trainers
* [x] Splitting the main engine to a general-purpose `config-rocket`
  * [ ] Migrate to use `config-rocket` instead of code duplication

## Usage (for users)

```sh
# On any platform: `Mac / Linux / Windows`, run a command:
npx roo-rocket --repo="NamesMT/roo-rocket"

# Interactively config your troop if config pack have parameters
# Nothing more, enjoy :)
```

## Notes:

### RR Terms Explained:

* `RR`: short for `Roo Rocket`

* `rocket assembly` / `config pack` / `troop`:
  * Refers to an object that `RR` can use to assemble (build out) configurations files, during installations or development hot reloads.

* `Training your troop` / `Crafting rocket assembly` / `Crafting config pack`:
  * Refers to the act of you creating the required structure for `RR` to work.

* `Rocket launch`:
  * Refers to the process of the user installing your `troop`, imagine you "ship/launch" your `troop` on a rocket to the user.

* `Rocket launch customize`:
  * Refers to the user's ability to configure the launch parameters and receive the wanted `troop`, i.e: with/without memory banks instructions, etc.

### References:

`Roo Rocket` is still a work-in-progress, but if you need something similar right now, try my [`RooFlow generic`](https://github.com/NamesMT/RooFlow-generic) config, it's a fork of [`RooFlow`](https://github.com/GreatScottyMac/RooFlow), enter the links to learn more.

## License

[Apache 2.0 © 2025 NamesMT](./LICENSE)
