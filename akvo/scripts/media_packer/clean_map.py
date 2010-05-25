#!/usr/bin/env python
# encoding: utf-8

import sys, os


#from bundle_map import *

def main():
    print 'In clean map'
    cwd = os.path.abspath(os.path.dirname(__file__))
    
    try:
        from akvo.scripts.media_packer.bundle_map import *
    except Exception, e:
        return False
    
    
    for bundle in BUNDLE_MAP:
        bundle_path = BUNDLE_MAP[bundle]['path']
        bundle_hash = BUNDLE_MAP[bundle]['hash']
        bundle_type = BUNDLE_MAP[bundle]['type']
        rm_string = 'rm %s%s_min_%s.%s' % (bundle_path, bundle,bundle_hash,bundle_type)
        
        try:
            os.system(rm_string)
        except Exception, e:
            raise e
        print 'Rmoved %s' % bundle
    
    try:
        rm_map_string = 'rm %s/bundle_map.py*' % cwd
        os.system(rm_map_string)
        #print rm_map_string
    except Exception, e:
        raise e
    
    print >> sys.stdout, 20 * "-" + "\nRemved all, yay :-)"
    
    return True

if __name__ == '__main__':
	main()