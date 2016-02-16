runn
===

**work in progress**

Hastily developed Node.js tasks scheduler/runner for those people at offices with very strict admins

More info is coming soon...

### .runnrc example

```
{
    "tasks": [{
        "when": "00 30 11 * * *",

        "what": {
            "cmd": "bash",
            "args": "~/send-email.sh"
        }
    }]
}
```
