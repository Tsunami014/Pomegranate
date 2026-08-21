import os
import argparse

from parse import Config, Options

parser = argparse.ArgumentParser()
parser.add_argument("-C", "--config", help="Use the provided file instead of ./main.ncl")

actions = parser.add_subparsers(dest="action", required=True)
for a, (_, h) in Options.items():
    actions.add_parser(a, help=h)

args = parser.parse_args()

conf = os.path.abspath(os.path.expanduser(args.config if args.config else "./main.ncl"))
conts = Config(conf)
getattr(conts, Options[args.action][0])()
