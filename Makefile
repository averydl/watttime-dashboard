.PHONY: install
install:
	pip3 install -r backend/requirements.txt -q
	mkdir -p backend/logs
	mkdir -p backend/cache

