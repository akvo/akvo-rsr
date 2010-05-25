#!/usr/bin/env python
# encoding: utf-8

import sys, os, hashlib

from akvo.scripts.media_packer.media_bundles import *

def main():
    
    cwd = os.path.abspath(os.path.dirname(__file__))
    BUNDLE_MAP = {} # Used to persist media budle hashes
    
    for bundle in MEDIA_BUNDLES:
        path = cwd + "/../../mediaroot/" + MEDIA_BUNDLES[bundle]['path']
        file_contents = ''
        
        for file_element in MEDIA_BUNDLES[bundle]['files']:
            try:
                file_path = path + file_element
                source_file = open(file_path)
                tmp = source_file.read()
                source_file.close()
                
                file_contents = '%s\n\n/*%s\n Contents from: %s\n%s*/\n\n%s' % (file_contents, 75*'-', file_element, 75*'-', tmp)
                
            except Exception, e:
                raise e
        
        # Persist to disk since the YUI compressor need a file
        bundle_file_path = path + bundle + "." + MEDIA_BUNDLES[bundle]['type']
        bundle_file = open(bundle_file_path,"w")
        bundle_file.write(file_contents)
        bundle_file.close()
        
        
        # Compressing using YUI Compres
        if MEDIA_BUNDLES[bundle]['compress'] == True:
            try:
                compressor_string = 'java -jar %s/yuicompressor-2.4.2.jar %s --charset utf-8 -v -o %s' % (cwd,bundle_file_path,bundle_file_path)
                os.system(compressor_string)
                
            except Exception, e:
                raise e
        
        print >> sys.stdout, "Compressed %s" % bundle
        
        # Name file with content hash
        completed_file = open(file_path)
        completed_file_contents = completed_file.read()
        bundle_hash = hashlib.sha1(completed_file_contents).hexdigest()
        completed_file.close()
        try:
            copy_string = 'cp %s%s.%s %s%s_min_%s.%s' % (path,bundle,MEDIA_BUNDLES[bundle]['type'],path,bundle,bundle_hash,MEDIA_BUNDLES[bundle]['type'])
            os.system(copy_string)
        except Exception, e:
            raise e
        
        # Remove file without the hash name, (this should be refactored as a mv operation instead!!!)
        try:
            rm_string = 'rm %s%s.%s %s%s.%s' % (path,bundle,MEDIA_BUNDLES[bundle]['type'],path,bundle,MEDIA_BUNDLES[bundle]['type'])
            os.system(rm_string)
        except Exception, e:
            raise e
            
        # Add bundle hash to 
        print 'about to do new stuff'
        #BUNDLE_MAP[bundle] = bundle_hash
        
        BUNDLE_ITEMS = {}
        print '1'
        BUNDLE_ITEMS['hash'] = bundle_hash
        BUNDLE_ITEMS['path'] = path
        BUNDLE_ITEMS['type'] = MEDIA_BUNDLES[bundle]['type']
        BUNDLE_MAP[bundle] = BUNDLE_ITEMS
        print 'did do new stuff'
        print BUNDLE_MAP
        print >> sys.stdout, "Copied to new name %s" % bundle
        
        print >> sys.stdout, "Completed %s" % bundle
        
    # Persist BUNDLE_MAP to file
    try:
        map_file_path = '%s/bundle_map.py' % cwd
        map_file = open (map_file_path,'w')
        map_file.write('BUNDLE_MAP = %s' % BUNDLE_MAP)
        map_file.close()
    except Exception, e:
        raise e
    
    print 'Persisted BUNDLE_MAP'
    
    print >> sys.stdout, 20 * "-" + "\nCompleted all, yay :-)"
    
    return True

if __name__ == '__main__':
	main()