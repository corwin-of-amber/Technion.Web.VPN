agent: src/agent.c FORCE
	rm -f $@
	gcc -o $@ src/agent.c
	sudo chown root $@ ; sudo chgrp staff $@ ; sudo chmod a+s $@

FORCE: