# roo-rocket-engine

**roo-rocket-engine** is the core of `roo-rocket` monorepo, containing all of the core logics that allows you to train and ship your rocket-powered `Roo` to the world.

## Training your Roo

### Start training

To start training your own `Roo`, `Roo Rocket` requires a `rocket assembly`, which is these components:
  * `frame/`: the rocket frame, containing the base files that will be processed and built out, only the listed patterns are allowed:
    * `.roomodes`: the `.roomodes` definition to add custom modes for the user.
    * `.roo/*`: the `.roo` folder, containing files that will populate/override instructions for Roo modes.
  * `fuel/`: the rocket fuel, containing the files that will be used as context to build the rocket, feel free to add any files as you need.
  * `rocket.config.ts`: the rocket config file, containing the instructions to for `RR` to assemble and allowing customization of the rocket.
