export const OptionableParseTypePipe = (pipe) => (param?: string) =>
  param === undefined ? param : pipe;
