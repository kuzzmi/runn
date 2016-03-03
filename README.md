runn
===

**work in progress**

Hastily developed Node.js tasks scheduler/runner for those people at offices with very strict admins

### Install
```
npm install -g runnjs
```

### Use
```
> runn --help

  Usage: runn [options]

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -f, --foreground  run in the foreground (the only working way, if you have absolutely NO control over you PC)

```

More info is coming soon...

### .runnrc example

#### Cron-like:
```
00 00,30 * * * * powershell C:\Users\Username\script.ps1
```

#### JSON:

**NOTE:** The format of .runnrc in JSON has been changed in 0.2.0.

```
{
    "tasks": [{
        "time": "00 30 11 * * *",
        "command": "bash",
        "args": "~/send-email.sh"
    }]
}
```
