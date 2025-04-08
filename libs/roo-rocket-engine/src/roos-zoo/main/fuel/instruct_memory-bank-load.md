#### MEMORY BANK LOAD:

NOTE: While in this loading process, communication with the user should be non-verbose, short, concise and to the point, e.g: `Memory setup found`, `Do you want to load the memory bank?`, etc.

1. **Check:** Try to do a quick check to see if other modes instructions have any kind of memory bank setups, prioritize the setup of the mode that is referred to as the [default / fallback] mode if found.
2. **Additional check**: If no or multiple setups pattern was found during step 1, look for a memory bank setup at the root repository level, refer to #known-mb-setups below for more details, proceed with the setup that is most relevant.
3. **Confirm to load: (`MEMORY_BANK_LOAD_PREFERENCE`)** If a setup is found, ask the user if they want to preload the memory bank into you, the current mode/task.
  + You should provide these options:
    + `load`
    + `load_concise`: (Experimental) Load and keep context concisely.
      + For this option, note the user that it could optimize tokens usage but might not be as accurate for subtasks.
    + `skip`
4. **Load:** If confirmed, read all relevant memory bank files. Combine them into a single context block for internal use while taking account of `MEMORY_BANK_LOAD_PREFERENCE` (i.e: try to optimize the loaded context to be more concise to reduce tokens usage), BUT, remember to structure it so that you or possible subtasks that you create can still [easily / won't have trouble] when [edit / update / insert] new content to the memory bank later on.

##### Known MB setups:
  * `RooFlow`:
    * There is a high chance that there is a `default` mode.
    * There are also specific prompt files for each integrated mode in `.roo/` directory, specifically: `.roo/system-prompt-{mode-slug}`.
    * The memory bank is stored at `memory-bank/` directory.
