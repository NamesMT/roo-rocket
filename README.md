<div align="center">

<h1>Roo Rocket</h1>

<h3>Easily create and deploy configurable <code>Roo Code</code> config packs!
</h3>
<img src="./branding.svg" alt="Roo Rocket's logo" width="320"/>

</div>

# roo-rocket [![powered by config-rocket][config-rocket-src]][config-rocket-href]

* [roo-rocket ](#roo-rocket-)
  * [Overview \& Features](#overview--features)
    * [`RR` for users:](#rr-for-users)
    * [`RR` for creators (trainers):](#rr-for-creators-trainers)
  * [Rationale](#rationale)
  * [Usage](#usage)
    * [For users](#for-users)
    * [For creators (trainers)](#for-creators-trainers)
  * [License](#license)
  * [Notes \& References](#notes--references)
    * [Ecosystem Terms / Dictionary Explained](#ecosystem-terms--dictionary-explained)
  * [Pending roadmap](#pending-roadmap)

## Overview & Features

**`roo-rocket`** is a toolkit/engine (and a community webpage coming soon!) that helps you create or install configurable `config pack`s, specfically targeting [**`Roo Code`**](https://github.com/RooVetGit/Roo-Code).

In simple words, **`Roo Rocket`** help you install/create `Roo Code` configurations, which can have these features:
  + 🔫 (Dangerously) optimized `Footgun` prompts (system prompt overrides)
  + 📑 Memory Banks
  + 🐱🦁🐯🐻 Smart / Custom Modes
  + 📚🕹️🔎 MCPs!
  + *And endlessly more!* 🚀

### `RR` for users:
  + **Cross-platform** 🪟🍏🐧
  + **Easy, interactive, safe install** of any any zip archive / `troop` (config pack) (dictionary: collective of kangaroos), whether its a public one shared by your friend, or your own, privately-stored.
    + `roo-rocket` does not allow any code execution, so the installation of a config pack is safe, but you should verify that the archive contains the files that you expect.  
    *(Tip: you can ask `Roo` to help analyze the installed instruction files and check if there is anything unusual)*

### `RR` for creators (trainers):
  + **Config type-safety**: powered by `Typescript (TS)`, providing type-safety, autocompletion, and typedoc documentation right in your IDE while crafting your `troop`s.
  + **Powerful creator candies**:
    + `parameters` that works interactively with your users.
    + `variables`, `excludes`, `filesBuilder` helps you conditionally customize your assemble process without code execution.
    + `fuel` context support that help you reduces duplication work in multiple files.
    + `frame` template for the quick file-to-file base bones.
    + `snapshot` that helps simulating of an existing user project, ensuring your configs will deploy correctly. (Intended for more advanced use case like testing AI agents) (TBA)
  + **Easy shipping**: Bundle your `troop`, or just create a zip archive, add it to a GitHub release, or upload it somewhere, and everyone can use it via `roo-rocket` CLI!

## Rationale

The strength of **`Roo Code`** lies in its customization power, and there's no centralized community and toolkit yet, so, let's build one!

## Usage

### For users

```sh
npx roo-rocket --repo="NamesMT/config-packs"
# Or by url: `npx roo-rocket --url=https://direct.url/to-arhive.zip`

# Interactively configure the installation parameters (if any)
# Nothing more, enjoy :)
```

### For creators (trainers)

* There are two ways to start:
  * For the full experience:
    * Generate a repo from [`config-packs-template`](https://github.com/NamesMT/config-packs-template)
      * > It's a template to create your own `config pack`s for `config-rocket` ecosystem.
    * Check `roo-rocket` rules here: [libs/roo-rocket](./libs/roo-rocket/README.md)
  * For a simple, fast start:
    * Just create a zip archive of your configuration files!  
    *(Tip: you can use  
    `npx config-rocket zip -i=".roomodes"`  
    if you don't yet have a handy zipper.)*
* Users can now use the `roo-rocket` CLI to install your configurations.

## License

[Apache 2.0 © 2025 NamesMT](./LICENSE)

## Notes & References

### [Ecosystem Terms / Dictionary Explained](./TERMS_EXPLATION.md)

## Pending roadmap

* [ ] A webpage, featuring the community Roo trainers
* [ ] Recruit more Roo trainers to join the community, contact me if **YOU** are interested!

<!-- Badges -->

[config-rocket-src]: https://img.shields.io/badge/⚙️🚀-%23180022.svg?logoColor=white
[config-rocket-href]: https://github.com/namesmt/config-rocket
