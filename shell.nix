{ pkgs ? import <nixpkgs> {} }:
let venvFold = ".venv";
in pkgs.mkShell {
  buildInputs = with pkgs; [
    libusb1
    python313
    python313Packages.pip
    python313Packages.debugpy
  ];

  shellHook = ''
    export LD_LIBRARY_PATH="${pkgs.libusb1}/lib:$LD_LIBRARY_PATH"

    if [[ ! -d "${venvFold}" ]]; then
        echo "Venv does not exist, creating..."
            python3 -m venv "${venvFold}"
            echo "*" > "${venvFold}/.gitignore"
        fi
    echo "Loading python..."
    source "${venvFold}/bin/activate"
    pip install "adb-shell[usb]" "py-nickel"
  '';
}
