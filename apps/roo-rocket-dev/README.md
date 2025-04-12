# roo-rocket-dev

This is a private development app to test `roo-rocket`, it's not meant to be published.

## Training your troop

### Start training

To start training your own `troop`, `Roo Rocket` requires a `rocket assembly`, which is these components:
  * `frame/`: the rocket frame, containing the base files that will be processed and built out, only the listed patterns are allowed:
    * `.roomodes`: the `.roomodes` definition to add custom modes for the user.
    * `.roo/*`: the `.roo` folder, containing files that will populate/override instructions for Roo modes.
  * `fuel/`: the rocket fuel, containing the files that will be used as context to build the rocket, feel free to add any files as you need.
  * `rocket.config.ts`: the rocket config file, containing the instructions to for `RR` to assemble and allowing customization of the rocket.
    * Utilizes `TypeScript` on development side for type safety & autocomplete DX, bundles to `JSON5`.
