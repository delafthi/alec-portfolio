{ lib, pkgs, ... }:
{
  projectRootFile = "flake.nix";
  programs = {
    # keep-sorted start
    actionlint.enable = true;
    biome.enable = true;
    biome.settings = lib.fromJSON (lib.readFile ../biome.json);
    biome.validate.enable = false;
    deadnix.enable = true;
    keep-sorted.enable = true;
    nixfmt.enable = true;
    rumdl-check.enable = true;
    statix.enable = true;
    yamlfmt.enable = true;
    # keep-sorted end
  };
  settings.formatter.tombi = {
    command = "${pkgs.tombi}/bin/tombi";
    options = [ "format" ];
    includes = [ "*.toml" ];
  };
}
