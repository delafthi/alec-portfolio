{
  mkShell,
  bun,
  config,
}:
mkShell {
  name = "default";
  inputsFrom = [ config.treefmt.build.devShell ];
  packages = [ bun ];
}
