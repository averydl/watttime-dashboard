.PHONY: install

install:
	pip3 install -r requirements.txt -q
	mkdir -p logs
	mkdir -p cache

