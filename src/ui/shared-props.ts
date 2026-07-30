export type PrimitiveConstructor = StringConstructor | NumberConstructor | BooleanConstructor
export type PrimitiveValue<TypeConstructor extends PrimitiveConstructor> = TypeConstructor extends StringConstructor ? string : TypeConstructor extends NumberConstructor ? number : boolean

export interface PrimitiveProp<TypeConstructor extends PrimitiveConstructor> {
  type: TypeConstructor
  required: boolean
  default?: PrimitiveValue<TypeConstructor>
}

export const getPrimitiveProp = <TypeConstructor extends PrimitiveConstructor>(type: TypeConstructor, required?: boolean, defaultValue?: PrimitiveValue<TypeConstructor>): PrimitiveProp<TypeConstructor> => {
  return {
    type,
    required: required ?? false,
    default: defaultValue
  }
}
