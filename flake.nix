{
  description = "Crm Nix flake";

  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";
  inputs.nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
	
  outputs = { self, nixpkgs, nixpkgs-unstable, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = { allowUnfree = true; };
        };
        unstable = import nixpkgs-unstable {
          inherit system;
          config = { allowUnfree = true; };
        };
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            docker # our container provider of choice. For now.
            docker-compose
            flyctl
          ];
        };
      }
    );
}
