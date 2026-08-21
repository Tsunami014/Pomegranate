# File specifications
The file uses [Nickel language](https://nickel-lang.org/user-manual/introduction/), which is similar to the language used in Nix files.

## The main file
The main file (usually named `main.ncl`) must be a list of other files.
This can be done by including regular file contents in the list directly, e.g.
```
[
  {
    apps = ["a", "b"],
    ip = "1.1.1.1"
  },
]
```
, or including imports to other regular files, e.g.
```
[
  import "sub.ncl",
]
```
. There can be as many file contents and/or imports as required.

Each file content will be merged where the last item will have priority, including combining array contents.

## Regular files
Regular files can contain the following keys:
