#!/usr/bin/env python
# encoding: utf-8

# This file is executed on git commit by the pre-commit hook

# 1. Clean up old files (bundle and map in the cleaner script)
# 2. Generate new files in the generate script (both media bundle files and a map file)
# 3. Add the new files to the git index before proceeding with the commit


import sys, os, hashlib

import cleaner, generator

def main():
    print 'Running packer...'
    
    # 1. Clean up old files (bundle and map in the cleaner script)
    if (cleaner.main()):
        print 'Cleaner did remove files'
    else:
        print 'Cleaner did not find a map file'
    
    # 2. Generate new files in the generate script (both media bundle files and a map file)
    if (generator.main()):
        print 'Generator did create new files'
    else:
        print 'Generator could not find a media_bundle file'
    
    # 3. Add the new files to the git index before proceeding with the commit
        
    return True

if __name__ == '__main__':
	main()