# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = doc
BUILDDIR      = public
DOCKER        ?=
USE_DOCKER    ?=  # Calls parts of make in docker

dc_run = docker-compose run --rm --no-deps web
# Function to optionally run a target in docker
docker = $(if $(USE_DOCKER) , $(dc_run) make $@ , $(1))

# Put it first so that "make" without argument is like "make help".
help:
	@$(call docker, $(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O))

.PHONY: help Makefile full-doc

api: Makefile
	rm -rf doc/modules
	$(call docker, sphinx-apidoc \
		--maxdepth 2 \
		--module-first \
		--separate \
		-o doc/modules \
		-H "Reference documentation" \
		--force \
			akvo \
			'*/migrations/*' \
			'*/tests/*' \
			'*_test.py' )

# Run all targets to generate HTML
full-doc: api html
# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(call docker, $(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O))
