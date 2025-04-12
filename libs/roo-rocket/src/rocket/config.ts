import type { UserInputConfig } from 'c12'
import { readFile } from 'node:fs/promises'
import { loadConfig } from 'c12'
import consola from 'consola'
import { dirname, resolve } from 'pathe'

export interface RocketConfigParameter {
  id: string
  resolver: RocketConfigParameterResolver
}

export type RocketConfigParameterResolver = RocketConfigParameterResolverOperationPrompt | RocketConfigParameterResolverOperationCondition

export type RocketConfigParameterResolverOperationPrompt = {
  operation: 'prompt'
  label: string
} & (
    {
      type: 'text'
      initial?: string
    } | {
      type: 'confirm'
      initial?: boolean
    }
  )

export interface RocketConfigParameterResolverOperationCondition {
  operation: 'condition'
  condition: RocketCondition
}

export interface RocketCondition<AllowedResult = string | true> {
  type: RocketConditionType
  subject: RocketCondition | string // Parameter id or nested condition
  condition: RocketCondition | string | boolean // Nested condition or statement
  result?: AllowedResult
}

export type RocketConditionType = 'match' | 'contain' | 'not'

/**
 * A fuel reference is a path to a fuel file, e.g: `fuel:instruct_very-nice-rocket.md`.
 */
export type FuelReference = `fuel:${string}`

export interface RocketConfig {
  /**
   * The rocket's available parameters, allowing users to customize the launch.
   */
  parameters?: RocketConfigParameter[]

  /**
   * A simple map to resolve the rocket's variables.
   */
  variablesResolver?: Record<string, string | FuelReference | RocketCondition<string | FuelReference>>

  /**
   * A simple map to resolve the rocket's excludes.
   */
  excludesResolver?: Record<string, RocketCondition<true>>
}

export function defineRocketConfig<RC extends RocketConfig>(config: RC): RC {
  return config
}

export async function loadRocketConfig(configOrPath: RocketConfig | string) {
  const { config } = typeof configOrPath === 'string'
    ? await loadConfig({
      name: 'rocket',
      cwd: dirname(configOrPath),
      configFile: configOrPath,
    })
    : { config: configOrPath }

  assertsRocketConfig(config)

  return config
}

export async function parseRocketConfig(configOrPath: RocketConfig | string) {
  const config = await loadRocketConfig(configOrPath)

  const resolvedParameters: Record<string, string | boolean> = {}

  for (const parameter of config.parameters ?? [])
    resolvedParameters[parameter.id] = await resolveParameter(parameter, resolvedParameters)

  const resolvedVariables: Record<string, string> = {}
  for (const [variableName, resolverValue] of Object.entries(config.variablesResolver ?? {}))
    resolvedVariables[variableName] = resolveVariable(resolverValue, resolvedParameters)

  const resolvedExcludes: Record<string, boolean> = {}
  for (const [excludeName, resolverValue] of Object.entries(config.excludesResolver ?? {}))
    resolvedExcludes[excludeName] = resolveExclude(resolverValue, resolvedParameters)

  return { config, resolvedParameters, resolvedVariables, resolvedExcludes }
}

/**
 * Parses the passes in `variables` and replace `FuelReference`s with its content.
 */
export async function supplyFuel(variables: Record<string, string>, fuelDir: string): Promise<Record<string, string>> {
  const fueledVariables: Record<string, string> = {}
  for (const key in variables) {
    if (variables[key].startsWith('fuel:')) {
      const referencedFuelName = variables[key].slice(5)
      const fuelContent = await readFile(resolve(fuelDir, referencedFuelName), 'utf8')
      fueledVariables[key] = fuelContent
    }
  }

  return { ...variables, ...fueledVariables }
}

export function assertsRocketConfig(config: UserInputConfig | RocketConfig): asserts config is RocketConfig {
  // Validate parameters array
  if (config.parameters) {
    if (!Array.isArray(config.parameters))
      throw new Error('Invalid RocketConfig: "parameters" must be an array.')
    // Call assertion for each parameter
    config.parameters.forEach(assertsRocketParameter)
  }

  // Validate variablesResolver object
  if (config.variablesResolver)
    assertsRocketVariablesResolver(config.variablesResolver)

  // Validate excludesResolver object
  if (config.excludesResolver)
    assertsRocketExcludesResolver(config.excludesResolver)
}

async function resolveParameterOperationPrompt(resolver: RocketConfigParameterResolverOperationPrompt): Promise<string | boolean> {
  // Yea the switch case is identical i know, but using one prompt only require some `as` casting
  switch (resolver.type) {
    case 'text':
      return await consola.prompt(resolver.label, { type: 'text', initial: resolver.initial, cancel: 'reject' })
    case 'confirm':
      return await consola.prompt(resolver.label, { type: 'confirm', initial: resolver.initial, cancel: 'reject' })
  }
}

/** Evaluates a simple condition */
function evaluateCondition(
  type: RocketConditionType,
  subjectValue: string | boolean | undefined,
  statement: string | boolean,
): boolean {
  switch (type) {
    case 'match':
      return subjectValue === statement
    case 'contain':
      if (typeof subjectValue !== 'string' || typeof statement !== 'string')
        throw new Error('"subject" and "statement" must be string under "contain" condition')
      return subjectValue.includes(statement)
    case 'not':
      return subjectValue !== statement
    default:
      throw new Error('Unexpected condition type')
  }
}

function resolveParameterOperationCondition(
  condition: RocketCondition,
  resolvedParameters: Record<string, string | boolean>,
): boolean {
  const subjectValue = typeof condition.subject === 'string'
    ? resolvedParameters[condition.subject] // Get value of another parameter
    : resolveParameterOperationCondition(condition.subject, resolvedParameters) // Resolve nested condition

  const conditionMet = typeof condition.condition === 'object'
    ? resolveParameterOperationCondition(condition.condition, resolvedParameters) // Resolve nested condition
    : evaluateCondition(condition.type, subjectValue, condition.condition) // Evaluate simple condition

  return conditionMet
}

async function resolveParameter(
  parameter: RocketConfigParameter,
  resolvedParameters: Record<string, string | boolean>,
): Promise<string | boolean> {
  switch (parameter.resolver.operation) {
    case 'prompt':
      return await resolveParameterOperationPrompt(parameter.resolver)
    case 'condition': {
      const condition = parameter.resolver.condition
      const conditionResult = resolveParameterOperationCondition(condition, resolvedParameters)
      return conditionResult ? (condition.result ?? true) : false
    }
  }
}

/**
 * Resolves a `variable` based on its condition.
 * Assumes the condition structure and result type have been pre-validated.
 */
function resolveVariable(
  resolverValue: string | RocketCondition<string>,
  resolvedParameters: Record<string, string | boolean>,
): string {
  // If the resolver value is already a string, return it directly
  if (typeof resolverValue === 'string')
    return resolverValue

  // If it's a condition object, resolve it
  const conditionMet = resolveParameterOperationCondition(resolverValue, resolvedParameters)

  return conditionMet ? resolverValue.result! : ''
}

/**
 * Resolves an `exclude` based on its condition.
 * Assumes the condition structure and result type have been pre-validated.
 */
function resolveExclude(
  resolverValue: boolean | RocketCondition<true>,
  resolvedParameters: Record<string, string | boolean>,
): boolean {
  // If the resolver value is already a boolean, return it directly
  if (typeof resolverValue === 'boolean')
    return resolverValue

  // If it's a condition object, resolve it
  const conditionMet = resolveParameterOperationCondition(resolverValue, resolvedParameters)

  return conditionMet ? resolverValue.result! : false
}

export function assertsRocketParameter(parameter: RocketConfigParameter): asserts parameter is RocketConfigParameter {
  if (
    typeof parameter?.id !== 'string'
    || assertsRocketParameterResolver(parameter.resolver)
  ) {
    throw new Error('Invalid parameter')
  }
}

export function assertsRocketParameterResolver(resolver: RocketConfigParameterResolver): asserts resolver is RocketConfigParameterResolver {
  if (
    !['prompt', 'condition'].includes(resolver?.operation)
  )
    throw new Error(`Invalid parameter resolver operation: '${resolver.operation}'`)

  switch (resolver.operation) {
    case 'prompt': {
      if (
        !['text', 'confirm'].includes(resolver.type)
      )
        throw new Error(`Invalid parameter resolver type: '${resolver.type}'`)

      break
    }

    case 'condition': {
      assertsRocketCondition(resolver.condition)

      break
    }
  }
}

export function assertsRocketVariablesResolver(resolver: NonNullable<RocketConfig['variablesResolver']>): asserts resolver is NonNullable<RocketConfig['variablesResolver']> {
  for (const [key, value] of Object.entries(resolver)) {
    if (typeof key !== 'string')
      throw new Error(`Invalid variable resolver key`)

    // Value must be a string OR a valid RocketCondition object
    if (typeof value !== 'string') {
      assertsRocketCondition(value)

      // Also ensure the condition's result is specifically a string
      if (typeof value.result !== 'string') {
        throw new TypeError(`Invalid variable resolver for "${key}": 'result' must be of type string, got ${typeof value.result}.`)
      }
    }
  }
}

export function assertsRocketExcludesResolver(resolver: NonNullable<RocketConfig['excludesResolver']>): asserts resolver is NonNullable<RocketConfig['excludesResolver']> {
  for (const [key, value] of Object.entries(resolver)) {
    if (typeof key !== 'string')
      throw new Error(`Invalid exclude resolver key`)

    assertsRocketCondition(value)

    // Also ensure the condition's result is specifically `true`
    if (value.result !== true) {
      throw new TypeError(`Invalid exclude resolver for "${key}": 'result' must be 'true', got ${value.result}.`)
    }
  }
}

export function assertsRocketCondition(condition: RocketCondition): asserts condition is RocketCondition {
  if (!['match', 'contain', 'not'].includes(condition.type))
    throw new Error(`Invalid parameter resolver condition type: '${condition.type}'`)

  if (typeof condition.subject !== 'string' && assertsRocketCondition(condition.subject))
    throw new Error(`Invalid parameter resolver condition subject`)

  if (typeof condition.condition !== 'string' && typeof condition.condition !== 'boolean' && assertsRocketCondition(condition.condition))
    throw new Error(`Invalid parameter resolver condition condition`)

  if (typeof condition.result !== 'string' && typeof condition.result !== 'boolean')
    throw new Error(`Invalid parameter resolver condition result`)
}
