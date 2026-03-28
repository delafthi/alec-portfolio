{
  mkShell,
  config,
  astro-language-server,
  bashInteractive,
  deno,
  nodejs,
  pnpm,
  typescript-language-server,
}:
mkShell {
  name = "default";
  inputsFrom = [ config.treefmt.build.devShell ];
  packages = [
    astro-language-server
    bashInteractive
    deno # required by @netlify/edge-functions-dev
    nodejs
    pnpm
    typescript-language-server
  ];
}
