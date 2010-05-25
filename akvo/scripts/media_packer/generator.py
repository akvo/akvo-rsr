#!/usr/bin/env python
# encoding: utf-8

import sys, os, hashlib

def main():
    #print 'Generating...'
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
        
        BUNDLE_ITEMS = {}
        BUNDLE_ITEMS['hash'] = bundle_hash
        BUNDLE_ITEMS['path'] = MEDIA_BUNDLES[bundle]['path']
        BUNDLE_ITEMS['type'] = MEDIA_BUNDLES[bundle]['type']
        BUNDLE_MAP[bundle] = BUNDLE_ITEMS
        
        
    # Persist BUNDLE_MAP to file
    try:
        map_file_path = '%s/map.py' % cwd
        map_file = open (map_file_path,'w')
        map_file.write('BUNDLE_MAP = %s' % BUNDLE_MAP)
        map_file.close()
    except Exception, e:
        print 'Could not persist the map file.'
        raise e

    return True

if __name__ == '__main__':
	main()