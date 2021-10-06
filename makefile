

json-api:
	cd ./api && node ../scripts/generate.mjs --schema

generate: $(DTS_FILES)
	cd ./api && node ../scripts/generate.mjs --dts


DTS_FILES=$(patsubst %.yaml, %.d.ts, $(wildcard api/*.yaml))

typings: $(DTS_FILES) # use `make json-api` before
api/%.d.ts: api/%.json
	npx openapi-typescript api/$*.json -o $@

test-app:
	cp -ru ../neutralinojs/bin  .
	cp -ru  ./bin/resources/icons  ./resources
	cp -ru  ./bin/resources/js     ./resources
	rm -r   ./bin/resources

	cp -u ../neutralino.js/dist/neutralino.js   ./resources/js
	cp -u ../neutralino.js/dist/neutralino.d.ts ./resources/js

	@echo
	@echo \###
	@echo
	@echo 'Use "neu run" to show and test the api.'

clean-test-app:
	rm -fr ./bin
	rm -fr ./resources/js
	rm -fr ./resources/css