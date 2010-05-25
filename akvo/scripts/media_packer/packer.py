#!/usr/bin/env python
# encoding: utf-8

import sys, os, hashlib

from map import BUNDLE_MAP
#from media_bundles import MEDIA_BUNDLES

def clean():
    cwd = os.path.abspath(os.path.dirname(__file__))
    
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
        rm_map_string = 'git rm %s/map.py' % cwd
        #print rm_map_string
        os.system(rm_map_string)
    except Exception, e:
        print 'Could not remove the map'
        pass
    
    '''    
    try:
        rm_map_pyc_string = 'rm %s/map.pyc' % cwd
        os.system(rm_map_pyc_string)
    except Exception, e:
        pass
    '''

    return True
    
def generate():
    cwd = os.path.abspath(os.path.dirname(__file__))
    
    try:
        from media_bundles import *
    except Exception, e:
        return False
        
    cwd = os.path.abspath(os.path.dirname(__file__))
    BUNDLE_MAP = {} # Used to persist media budle hashes
    
    for bundle in MEDIA_BUNDLES:
        file_contents = ''
        path = MEDIA_BUNDLES[bundle]['path']

        for file_element in MEDIA_BUNDLES[bundle]['files']:
            try:
                file_path = path + file_element
                source_file = open('%s/../../mediaroot/%s' % (cwd,file_path) )
                tmp = source_file.read()
                source_file.close()                
                file_contents = '%s\n\n/*%s\n Contents from: %s\n%s*/\n\n%s' % (file_contents, 75*'-', file_element, 75*'-', tmp)
            except Exception, e:
                print 'Could not find bundle source file: %s' % file_element
                raise e
    
        # Persist to disk since the YUI compressor need a file
        bundle_file_path = '%s/../../mediaroot/%s%s.%s' % (cwd, path, bundle, MEDIA_BUNDLES[bundle]['type'])
        bundle_file = open(bundle_file_path,"w")
        bundle_file.write(file_contents)
        bundle_file.close()
        
        # Compressing using YUI Compres
        if MEDIA_BUNDLES[bundle]['compress'] == True:
            try:
                compressor_string = 'java -jar %s/yuicompressor-2.4.2.jar %s --charset utf-8 -v -o %s' % (cwd,bundle_file_path,bundle_file_path)
                #print compressor_string
                os.system(compressor_string)
            except Exception, e:
                print 'Problem with running the YUICompressor'
                raise e
        
        # Name file with content hash
        completed_file = open(bundle_file_path)
        completed_file_contents = completed_file.read()
        completed_file.close()
        bundle_hash = hashlib.sha1(completed_file_contents).hexdigest()
        
        try:
            mv_string = 'mv %s %s/../../mediaroot/%s%s_min_%s.%s' % (bundle_file_path, cwd, MEDIA_BUNDLES[bundle]['path'], bundle, bundle_hash, MEDIA_BUNDLES[bundle]['type'])
            #print mv_string
            os.system(mv_string)
        except Exception, e:
            print 'Could not add hash to file name'
            raise e
        
        # Add the new file to the git index
        try:
            git_add_string = 'git add %s/../../mediaroot/%s%s_min_%s.%s' % (cwd, MEDIA_BUNDLES[bundle]['path'], bundle, bundle_hash, MEDIA_BUNDLES[bundle]['type'])
            #print git_add_string
            os.system(git_add_string)
        except Exception, e:
            print 'Could not add the bundle file to the Git index'
            raise e
            
        
        # Prepare for the map file 
        BUNDLE_ITEMS = {}
        BUNDLE_ITEMS['hash'] = bundle_hash
        BUNDLE_ITEMS['path'] = MEDIA_BUNDLES[bundle]['path']
        BUNDLE_ITEMS['type'] = MEDIA_BUNDLES[bundle]['type']
        BUNDLE_MAP[bundle] = BUNDLE_ITEMS
        
        print '%s compressed & packed!' % bundle
        
    # Persist BUNDLE_MAP to file
    try:
        map_file_path = '%s/map.py' % cwd
        map_file = open (map_file_path,'w')
        map_file.write('BUNDLE_MAP = %s' % BUNDLE_MAP)
        map_file.close()
    except Exception, e:
        print 'Could not persist the map file.'
        raise e

    # Add map to the Git index
    try:
        git_add_map_string = 'git add %s/map.py' % cwd
        os.system(git_add_map_string)
        #print git_add_map_string
        
    except Exception, e:
        raise e

    return True


def main():
    print 'Running packer...'
    
    # 1. Clean up old files (bundle and map in the cleaner script)
    if (clean()):
        print 'Cleaner did remove files'
    else:
        print 'Cleaner did not find a map file'
    
    # 2. Generate new files in the generate script (both media bundle files and a map file)
    if (generate()):
        print 'Generator did create new files'
    else:
        print 'Generator could not find a media_bundle file'
        
    return True
    
if __name__ == '__main__':
	main()