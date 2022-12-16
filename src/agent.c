#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <poll.h>
#include <signal.h>

/* This is going to be run with setuid so this better be a full path */
const char *EXE = "/opt/homebrew/bin/openconnect";
const char *URL = "vpn.technion.ac.il";


int main(int argc, char *argv[])
{
    if (setuid(0) != 0) { perror("setuid"); }
    char cookie_arg[1024];
    snprintf(cookie_arg, sizeof(cookie_arg),
        "--cookie=DSID=%s", argv[1]);

    pid_t pid = fork();
    if (pid == 0) {
        execl(EXE, "openconnect", "--protocol=nc", cookie_arg, URL);
    
        perror("exec");
        exit(1);
    }

    printf("before poll\n"); fflush(stdout);
    struct pollfd fds[] = { { .fd = 0, .events = POLLIN } };
    poll(fds, 1, -1);
    printf("exiting (pid=%d)\n", pid); fflush(stdout);
    kill(pid, SIGHUP);

    return 0;
}
