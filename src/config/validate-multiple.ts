export type ValidateFunction = (
  config: Record<string, any>
) => Record<string, any>
export const validateMultiple =
  (validateFunctions: ValidateFunction[]) =>
  (config: Record<string, unknown>) => {
    let finalOutput = {}
    validateFunctions.forEach((validateFunction) => {
      const result = validateFunction(config)
      finalOutput = {
        ...finalOutput,
        ...result,
      }
    })
    return finalOutput
  }
