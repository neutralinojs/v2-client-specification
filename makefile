
info:
	@echo
	@echo 'json       : Generate a bundled JSON API and model schemas'
	@echo 'json-watch : Watch mode of the 'json' command'
	@echo 'dts        : Generate the Typescript definition file'
	@echo 'app        : Generate the Neutralino test application'

all: json typings app

json:
	cd ./src && node ./run.js --build-json

json-watch:
	cd ./src && node ./run.js --watch-json

dts:
	node ./src/run.js --build-dts
	#cd ./src && node ./run.js --build-dts

app:
	cp -ru ../neutralinojs/bin  .
	cp -ru  ./bin/resources/icons  ./test
	cp -ru  ./bin/resources/js     ./test
	rm -r   ./bin/resources

	cp -u ../neutralino.js/dist/neutralino.js   ./test/js
	cp -u ../neutralino.js/dist/neutralino.d.ts ./test/js

	@echo
	@echo 'Use "neu run" to show and test the api.'

clean-app:
	rm -fr ./bin
	rm -fr ./test/js
	rm -fr ./test/css