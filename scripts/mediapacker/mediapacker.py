#!/usr/bin/env python
# encoding: utf-8

import sys, os

from media_bundles import *

def main():
    cwd = os.getcwd()
    cwd = os.path.abspath(os.path.dirname(__file__))

    for bundle in MEDIA_BUNDLES:
        path = cwd + "/../../akvo/mediaroot/" + MEDIA_BUNDLES[bundle]['path']
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
                compressor_string = "java -jar " + cwd + "/yuicompressor-2.4.2.jar "
                compressor_string +=  bundle_file_path + " --charset utf-8 -v -o " + bundle_file_path
                os.system(compressor_string)
                
            except Exception, e:
                raise e
        
        print >> sys.stdout, "Completed %s" % bundle

        
    print >> sys.stdout, 20 * "-" + "\nCompleted all, yay :-)"

if __name__ == '__main__':
	main()