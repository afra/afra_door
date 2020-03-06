# Requirements in /etc

## /etc/passwd

Add users 'open', 'close' and 'restart' with scripts from /opt as login shell:

    open:x:1001:1001::/home/open:/opt/afra_door/open.sh
    close:x:1002:1002::/home/close:/opt/afra_door/close.sh
    restart:x:1003:1003::/home/restart:/opt/afra_door/restart_service.sh

## /etc/sudoers

    Cmnd_Alias RESTART_LOCK=/bin/systemctl restart afra_lock_server.service
    Cmnd_Alias RESTART_BLUETOOTH=/bin/systemctl restart bluetooth.service
    restart ALL=(ALL:ALL) NOPASSWD: RESTART_LOCK, RESTART_BLUETOOTH

