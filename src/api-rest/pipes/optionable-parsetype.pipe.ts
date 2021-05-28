export const OptionableParseTypePipe = (pipe) => (param?: string) =>
  param === undefined ? param : new pipe().transform(param);
