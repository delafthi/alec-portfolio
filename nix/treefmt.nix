{ lib, pkgs, ... }:
{
  projectRootFile = "flake.nix";
  programs = {
    # keep-sorted start
    actionlint.enable = true;
    biome.enable = true;
    biome.settings = lib.fromJSON (lib.readFile ../biome.json);
    biome.validate.schema = "${pkgs.biome}/share/schema.json";
    deadnix.enable = true;
    keep-sorted.enable = true;
    nixfmt.enable = true;
    rumdl-format.enable = true;
    statix.enable = true;
    typos.enable = true;
    # keep-sorted end
  };
  settings.formatter.tombi = {
    command = "${pkgs.tombi}/bin/tombi";
    options = [
      "format"
      "--offline"
    ];
    includes = [ "*.toml" ];
  };
}
