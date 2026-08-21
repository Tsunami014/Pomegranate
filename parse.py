import os
import nickel
import json

Options = {
    "test": ("test", "Test the thing")
}

with open(os.path.abspath(os.path.join(__file__, '../schema.ncl'))) as f:
    SCHEMA = f.read()
LIB_PTH = os.path.abspath(os.path.join(__file__, '../lib/'))

class Config:
    def __init__(self, pth):
        os.chdir(os.path.dirname(pth))
        res1 = nickel.run(
            'let modules = import '+json.dumps(os.path.basename(pth))+' in\n'
            + SCHEMA, [LIB_PTH]
        )
        res = json.loads(res1)
        pass

    def test(self):
        pass
