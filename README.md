# Effect HTTP Server Example

## Getting Started

- On Linux, install NIX
  sh <(curl -L https://nixos.org/nix/install) --no-daemon
  nix develop ## This will download depenedencies in flake.nix and put you in another shell (exit with exit), pnpm install etc.
  Run `echo $IN_NIX_SHELL` to see if you're in a shell (impure or pure says that you are)

Make sure to create a `.env` file in the root of the repository based on the `.env.example` file.
