<div align="center">

# Roo Rocket

<h3>The all-in-one equipment that you and Roo wants!</h3>
<img src="./branding.svg" alt="Roo Rocket's logo" width="320"/>
<h5>(And an amazing base for Roo trainers)</h5>

<h2>Work-in-progress!</h2>
</div>

## Overview

***Roo Rocket**, the all-in-one equipment that you and Roo wants!"*

It's a set of tools that helps you create or install any complete config pack setup for **`Roo Code`**, including features like:
  + Optimized Footgun (system prompt overrides)
  + Memory Banks
  + Smart / Custom Modes
  + *And endlessly more!*

`RR` for users:
  + `Roo Rocket` for user is an engine, offering a super easy install of any `Roo` (`config pack`), whether its a public one shared by your friend, or your own private Roo.

`RR` for creators (trainers):
  + Fork, train your own version of Roo, create a GitHub release, and everyone can use it via `Roo Rocket` CLI!
  + Provides an elegant DX process for training, like auto loading a `snapshot` that you could test your prompts on, `context` support that help you reduces duplication work in multiple files.

## Rationale

`Roo Code` is shipping some amazing enhancements for customizations, and there's no good hub and base for Roo trainers yet, so, let's build one!

## Objectives / Roadmap

* [x] A pretty, *OPTIMIZED* image!
* [x] Finish the initial repo layout.
  * [x] Main engine and CLI.
    * [x] Ability to assemble the rocket from `frame` and `fuel`.
    * [x] Ability to customize the rocket launch using `rocket.config.ts`.
    * [x] Ability to bundle the `config pack` for safe distribution.
    * [ ] CLI: Ability to download and unpack a bundled `config pack`.
      * [ ] From URL.
      * [ ] Shortcut for GitHub repo with release.
  * [x] Local development app for playground testing.
* [x] Development environment with amazing DX and power.
  * [x] DRY: `fuel` context system that allows reusable contexts to be defined and used across multiple files, reducing duplication.
  * [x] Configurable: Allowing for users to choose their own flavors of Rocket.
* [ ] Trainers branch with clean, specialized codebase for Roo trainers.
* [ ] Simple setup.
  * Installing should be a breeze, simply execute a command, and `Roo Rocket` is ready to go, on any platform!
* [ ] Working base prompts
* [ ] Smart, optimized modes
* [ ] A webpage, featuring the community Roo trainers
* [ ] Splitting the main engine to a general-purpose `config-rocket`

## The expected user experience

*don't try it doesn't work yet XD*

```sh
# On any platform: `Mac / Linux / Windows`, run a command:
npx roo-rocket --trainer="NamesMT"

# Interactively config your Roo if needed
# Nothing more, enjoy :)
```

## Notes:

### RR Terms Explained:

* `RR`: short for `Roo Rocket`

* `rocket assembly` / `config pack` / `Roo`:
  * Refers to an object that `RR` can use to build out `Roo Code` configurations files, doing installations or development hot reloads.

* `Training your Roo` / `Crafting rocket assembly` / `Crafting config pack`:
  * Refers to the act of you creating the required structure for `RR` to work, more details will be available in `trainer` template in the future.

* `Rocket launch`:
  * Refers to the process of the user installing your `Roo`, imagine you "ship" / "launch" your `Roo` on a rocket to the user.

* `Rocket launch customize`:
  * Refers to the user's ability to configure the launch parameters and receive the wanted `Roo` version.

### References:

`Roo Rocket` is still a work-in-progress, but if you need something similar right now, try my [`RooFlow generic`](https://github.com/NamesMT/RooFlow-generic) config, it's a fork of [`RooFlow`](https://github.com/GreatScottyMac/RooFlow), enter the links to learn more.

## License

[Apache 2.0 © 2025 NamesMT](./LICENSE)
