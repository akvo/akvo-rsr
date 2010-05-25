#!/usr/bin/env python
# encoding: utf-8

import sys, os

def main():
    #print 'Cleaning...'
    cwd = os.path.abspath(os.path.dirname(__file__))
    
    try:
        from map import *
    except Exception, e:
        return False
    
    for bundle in BUNDLE_MAP:
        bundle_path = BUNDLE_MAP[bundle]['path']
        bundle_hash = BUNDLE_MAP[bundle]['hash']
        bundle_type = BUNDLE_MAP[bundle]['type']
        rm_string = 'git rm %s/../../mediaroot/%s%s_min_%s.%s' % (cwd, bundle_path, bundle,bundle_hash,bundle_type)

        try:
            #print rm_string
            os.system(rm_string)   
            #print 'Removed %s' % bundle
        except Exception, e:
            print 'Could not remove the %s bundle' % bundle
            pass
    
    try:
        rm_map_string = 'git rm %s/map.py*' % cwd
        #print rm_map_string
        os.system(rm_map_string)
    except Exception, e:
        print 'Could not remove the map'
        pass

    return True

if __name__ == '__main__':
	main()