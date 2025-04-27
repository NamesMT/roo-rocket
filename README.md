<div align="center">

# Roo Rocket

<h3>Easily create and deploy configurable <code>Roo Code</code> config packs!
</h3>
<img src="./branding.svg" alt="Roo Rocket's logo" width="320"/>

</div>

## Overview

**`roo-rocket`**, an extends of `config-rocket`, is a toolkit/engine (and a community webpage coming soon!) that helps you create or install configurable config packs, specfically targeting `Roo Code`.

In simple words, **`Roo Rocket`** help you easily install `Roo Code` configurations, which can have these features:
  + 🔫 (Dangerously) optimized `Footgun` prompts (system prompt overrides)
  + 📑 Memory Banks
  + 🐱🦁🐯🐻 Smart / Custom Modes
  + 📚🕹️🔎 MCPs!
  + *And endlessly more!* 🚀

`RR` for users:
  + Super easy, safe install of any zip archive / `troop` (config pack) (dictionary: collective of kangaroos), whether its a public one shared by your friend, or your own, privately-stored.
    + `RR` does not allow any code execution, so the installation of a config pack is safe, but you should verify if the files after unpacked are what you expect.  
    *(Tip: you can ask `Roo` to help ignore the file's comments and strictly analyze the installed instruction files if there is anything unusual)*

`RR` for creators (trainers):
  + Type-safety and autocompletion while training your `troop`.
  + Supports DX candies like:
    + `fuel` context support that help you reduces duplication work in multiple files.
    + `snapshot` that helps you easily setup/reset a codebase structure to test the agent. (coming soon)
  + Create a GitHub release, or upload it somewhere, and everyone can use it via `roo-rocket` CLI!

## Rationale

The strength of `Roo Code` lies in its customization power, and there's no centralized community and toolkit yet, so, let's build one!

## Usage (for users)

```sh
# On any platform: `Mac / Linux / Windows`, run a command:
npx roo-rocket --repo="NamesMT/config-packs"

# Interactively configure the installation parameters (if any)
# Nothing more, enjoy :)
```

## Usage (for trainers)

* There are two ways to start:
  * For the full experience:
    * Generate a repo from [`config-packs-template`](https://github.com/NamesMT/config-packs-template)
      * > It's a template to create your own `config packs` for `config-rocket` ecosystem.
    * Check `roo-rocket` rules here: [libs/roo-rocket](./libs/roo-rocket/README.md)
  * Or a simple, fast start: just create a zip archive of your configuration files!
    * *Tip: you can use  
    `npx --package=config-rocket rocket-zip -i=".roomodes"`  
    if you don't yet have a handy zipper.*
* Users can now use the `roo-rocket` CLI to install your configurations.

## Notes:

### [> RR Terms Explained <](./TERMS_EXPLATION.md)

## Pending roadmap

* [ ] A webpage, featuring the community Roo trainers
* [ ] Recruit more Roo trainers to join the community, contact me if **YOU** are interested!

## License

[Apache 2.0 © 2025 NamesMT](./LICENSE)
