#!/usr/bin/env python
# encoding: utf-8

import sys, os

#from akvo.scripts.media_packer.media_bundles import *
from bundle_map import *

def main():
    
    cwd = os.path.abspath(os.path.dirname(__file__))
    
    for bundle in BUNDLE_MAP:
        bundle_path = BUNDLE_MAP[bundle]['path']
        bundle_hash = BUNDLE_MAP[bundle]['hash']
        bundle_type = BUNDLE_MAP[bundle]['type']
        rm_string = 'rm %s%s_min_%s.%s' % (bundle_path, bundle,bundle_hash,bundle_type)
        
        try:
            os.system(rm_string)
        except Exception, e:
            raise e
        
    print >> sys.stdout, 20 * "-" + "\nRemved all, yay :-)"
    
    return True

if __name__ == '__main__':
	main()