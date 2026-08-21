import os
from usb1 import USBErrorBusy
from adb_shell.adb_device import AdbDeviceUsb
from adb_shell.auth.sign_pythonrsa import PythonRSASigner

class Shell:
    _inst: 'Shell' = None
    signer: PythonRSASigner = None
    device: AdbDeviceUsb = None

    def __enter__(self):
        try:
            self.device.connect(rsa_keys=[self.signer], auth_timeout_s=5.0)
        except USBErrorBusy:
            print("The USB device is busy! Please close anything currently using it (for example other adb applications)")
            raise
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.device.close()

    def __call__(self, cmd: str) -> str:
        return self.device.shell('getprop ro.product.model')

    def __new__(cls):
        if cls._inst is None:
            keypth = os.path.expanduser('~/.android/adbkey')
            with open(keypth, 'r') as f:
                private_key = f.read()
            with open(keypth+'.pub', 'r') as f:
                public_key = f.read()

            cls.signer = PythonRSASigner(public_key, private_key)
            cls.device = AdbDeviceUsb()

            cls._inst = super().__new__(cls)
        return cls._inst
