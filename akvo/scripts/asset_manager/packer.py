#!/usr/bin/env python
# encoding: utf-8

import sys, os, hashlib, subprocess

'''
Removes old files.

1. Remove each map entry with git rm.
2. Remove the map file.
'''
def clean():
    cwd = os.path.abspath(os.path.dirname(__file__))

    try:
        from map import BUNDLE_MAP
    except Exception, e:
        return False
    
    #1. Remove each map entry with git rm.
    for bundle in BUNDLE_MAP:
        bundle_path = BUNDLE_MAP[bundle]['path']
        bundle_hash = BUNDLE_MAP[bundle]['hash']
        bundle_type = BUNDLE_MAP[bundle]['type']
        
        try:
            rm_string = 'git rm --quiet %s/../../mediaroot/%s/build/%s_min_%s.%s' % (cwd, bundle_path, bundle,bundle_hash,bundle_type)
            retcode = subprocess.call(rm_string, shell=True)
            if retcode < 0:
                print >>sys.stderr, "git rm was terminated by signal", -retcode
        except OSError, e:
            print 'Could not remove old bundle files. Got error %s' % e
    
    #2. Remove the map file.
    try:
        rm_map_string = 'git rm --quiet %s/map.py' % cwd
        retcode = subprocess.call(rm_map_string, shell=True)
        if retcode < 0:
            print >>sys.stderr, "git rm was terminated by signal", -retcode
    except OSError, e:
        print 'Could not remove the map. Got error %s' % e
    
    return True

'''
Generate new content.

1.  Handle bundles file elements
    1.1 Combine files into one bundle file
    1.2 Persist to disk since the YUI compressor need a file
    1.3 Compressing using YUI Compress
    1.4 Name file with content hash
    1.5 Add the new file to the git index
    1.6 Add file to the map
    1.7 If css bundle create a raw file for devlopment
2. Handle the map file
    2.1 Persist map file
    2.2 Add map to the Git index
'''
def generate():
    cwd = os.path.abspath(os.path.dirname(__file__))
    try:
        from asset_bundles import ASSET_BUNDLES
    except Exception, e:
        print e.message
        return False
        
    cwd = os.path.abspath(os.path.dirname(__file__))
    BUNDLE_MAP = {} # Used to persist asset budle hashes
    
    # 1. Handle each bundles file element
    for bundle in ASSET_BUNDLES:
        file_contents = ''
        raw_file_contents = ''
        path = ASSET_BUNDLES[bundle]['path']

        # 1.1 Combine files into one bundle file
        for file_element in ASSET_BUNDLES[bundle]['files']:
            try:
                file_path = path + 'src/' + file_element
                source_file = open('%s/../../mediaroot/%s' % (cwd,file_path) )
                tmp = source_file.read()
                source_file.close()                
                file_contents = '%s\n\n/*%s\n Contents from: %s\n%s*/\n\n%s' % (file_contents, 75*'-', file_element, 75*'-', tmp)
                if ASSET_BUNDLES[bundle]['type'] == 'css':
                    raw_file_contents = '%s@import url("%s%s");\n' % (raw_file_contents, '../src/', file_element)
            except Exception, e:
                print 'Could not find bundle source file: %s' % file_element
                raise e

        # 1.2 Persist to disk since the YUI compressor need a file
        bundle_file_path = '%s/../../mediaroot/%ssrc/%s.%s' % (cwd, path, bundle, ASSET_BUNDLES[bundle]['type'])
        bundle_file = open(bundle_file_path,"w")
        bundle_file.write(file_contents)
        bundle_file.close()
        
        # 1.3 Compressing using YUI Compress. We are using --preserve-semi to be JSLint compatible
        if ASSET_BUNDLES[bundle]['compress'] == True:
            try:
                compressor_string = 'java -jar %s/yuicompressor-2.4.2.jar %s --charset utf-8 --preserve-semi -o %s' % (cwd,bundle_file_path,bundle_file_path)
                retcode = subprocess.call(compressor_string, shell=True)
                if retcode < 0:
                    print >>sys.stderr, "Yuicompressor was terminated by signal", -retcode
            except OSError, e:
                print 'Problem with running the YUICompressor. Got error: %s' % e
                raise e

        # 1.4 Name file with content hash
        completed_file = open(bundle_file_path)
        completed_file_contents = completed_file.read()
        completed_file.close()
        bundle_hash = hashlib.sha1(completed_file_contents).hexdigest()
        
        try:
            mv_string = 'mv %s %s/../../mediaroot/%sbuild/%s_min_%s.%s' % (bundle_file_path, cwd, ASSET_BUNDLES[bundle]['path'], bundle, bundle_hash, ASSET_BUNDLES[bundle]['type'])
            retcode = subprocess.call(mv_string, shell=True)
            if retcode < 0:
                print >>sys.stderr, "Could not move (rename) the bundle file, Move was terminated by signal", -retcode
        except OSError, e:
            print 'Could not add hash to file name, Got error: %s' %e
            raise e
        
        # 1.5 Add the new file to the git index
        try:
            git_add_string = 'git add %s/../../mediaroot/%sbuild/%s_min_%s.%s' % (cwd, ASSET_BUNDLES[bundle]['path'], bundle, bundle_hash, ASSET_BUNDLES[bundle]['type'])
            retcode = subprocess.call(git_add_string, shell=True)
            if retcode < 0:
                print >>sys.stderr, "Could add the file to the git index, Git add was terminated by signal", -retcode
        except OSError, e:
            print 'Could not add the bundle file to the Git index. Got error: %s' % e
            raise e
            
        # 1.6 Add file to the map
        BUNDLE_ITEMS = {}
        BUNDLE_ITEMS['hash'] = bundle_hash
        BUNDLE_ITEMS['path'] = ASSET_BUNDLES[bundle]['path']
        BUNDLE_ITEMS['type'] = ASSET_BUNDLES[bundle]['type']
        BUNDLE_MAP[bundle] = BUNDLE_ITEMS
        
        # 1.7 If css bundle create a raw file for devlopment
        if ASSET_BUNDLES[bundle]['type'] == 'css':
            try:
                raw_file_path = '%s/../../mediaroot/%sbuild/%s_raw.css' % (cwd, path, bundle,)
                raw_file = open(raw_file_path,"w")
                raw_file.write(raw_file_contents)
                raw_file.close()
            except Exception, e:
                print 'Could not write raw file'
            
            try:
                git_add_raw_file_string = 'git add %s' % raw_file_path
                retcode = subprocess.call(git_add_raw_file_string, shell=True)
                if retcode < 0:
                    print >>sys.stderr, "Could add raw file to the git index, Git add was terminated by signal", -retcode
            except OSError, e:
                print 'Could not add the new raw file to git. Got error: %s' % e
        
        print '%s packed!' % bundle

    # 2. Handle the map file

    # 2.1 Persist map file
    try:
        map_file_path = '%s/map.py' % cwd
        map_file = open (map_file_path,'w')
        map_file.write('BUNDLE_MAP = %s' % BUNDLE_MAP)
        map_file.close()
    except Exception, e:
        print 'Could not persist the map file.'
        raise e

    # 2.2 Add map to the Git index
    try:
        git_add_map_string = 'git add %s/map.py' % cwd
        retcode = subprocess.call(git_add_map_string, shell=True)
        if retcode < 0:
            print >>sys.stderr, "Could add the map file to the git index, Git add was terminated by signal", -retcode
    except OSError, e:
        raise e

    return True


def main():
    print 'Running packer...'
    
    # 1. Clean up old files
    if not clean():
        print 'Cleaner did not find a map file'
    
    # 2. Generate new files (asset bundle files and map file)
    if not generate():
        print 'Generator could not find a asset_bundle file'
        
    return True
    
if __name__ == '__main__':
	main()