import os
import argparse
import nickel
import json
from usb1 import USBErrorBusy
from adb_shell.adb_device import AdbDeviceUsb
from adb_shell.auth.sign_pythonrsa import PythonRSASigner

parser = argparse.ArgumentParser()
parser.add_argument("-C", "--config", help="Use the provided file instead of ./main.nkl")
args = parser.parse_args()

if args.config:
    conf = args.config
else:
    conf = "./main.nkl"
with open(os.path.abspath(os.path.expanduser(conf))) as f:
    res1 = nickel.run(f.read())
    res2 = json.loads(res1)

exit()

keypth = os.path.expanduser('~/.android/adbkey')
with open(keypth, 'r') as f:
    private_key = f.read()
with open(keypth+'.pub', 'r') as f:
    public_key = f.read()

signer = PythonRSASigner(public_key, private_key)
device = AdbDeviceUsb()

def main():
    output = device.shell('getprop ro.product.model')
    print(f"Device Model: {output.strip()}")
    files = device.shell('ls /sdcard')
    print("Files in SDCard:\n", files)

try:
    device.connect(rsa_keys=[signer], auth_timeout_s=5.0)
    print("Successfully connected to the device via USB!")
    main()
except USBErrorBusy:
    print("The USB device is busy! Please close anything currently using it (for example other adb applications)")
finally:
    device.close()

