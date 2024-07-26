# Make commands for easier local deployment

install:
	npm install

build: install
	echo TODO

test-unit:
	echo TODO

run:
	# start the development server and open a new browser tab to the web app
	npm run dev -- --open

lint:
	eslint

pull-develop:
	# update the current branch with the latest from remote develop
	git pull && git pull --rebase origin develop

pull-local-develop:
	# update the current branch with the latest from local develop
	git pull --rebase . develop

reset-prod:
	# force the current branch to EXACTLY match the remote prod branch
	git reset --hard origin/prod

reset-develop:
	# force the current branch to EXACTLY match the remote develop branch
	git reset --hard origin/develop