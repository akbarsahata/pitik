current_dir = $(shell pwd)
PROTO_DIR = $(current_dir)/src/proto/
PROTO_LIST = $(PROTO_DIR)/*.proto
pbjs = $(current_dir)/node_modules/.bin/pbjs
pbts = $(current_dir)/node_modules/.bin/pbts
PROTO_COMPILED_FILE = $(PROTO_DIR)/bundle.js
PROTO_BUNDLE_FILE = $(PROTO_DIR)/bundle.d.ts

generate-proto:
	$(pbjs) -t static-module -w commonjs -o $(PROTO_COMPILED_FILE) $(PROTO_LIST) | $(pbts) --lint -o $(PROTO_BUNDLE_FILE) $(PROTO_COMPILED_FILE)
