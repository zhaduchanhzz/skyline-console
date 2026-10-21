# Run the console without OpenStack

This local development mode serves the Skyline Console and a small mock API
from the same Webpack server. It does not start Skyline API Server, Keystone, or
other OpenStack services.

From `skyline-console`:

```powershell
npm install
npm run local
```

Open <http://127.0.0.1:8089/auth/login> and sign in with:

| Field    | Value       |
| -------- | ----------- |
| Region   | `RegionOne` |
| Username | `admin`     |
| Password | `admin`     |

`npm run mock` is an alias for `npm run local`. Set `SKYLINE_LOCAL_PORT` before
starting if port 8089 is occupied. The server listens on `127.0.0.1` only.

The mock API provides a local admin session, configuration, and empty resource
lists so the dashboard and navigation can be viewed. Resource changes return
HTTP 501. Use `npm run dev` with a configured Skyline/OpenStack gateway for real
cloud operations.
