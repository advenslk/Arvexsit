# ArveX Hosting order automation

This repository now contains the server-side order automation in `automation-server.js`. It is deliberately separate from the existing CMS/Auth API on port 5000.

## Required server environment

Add these server-only variables to `/var/www/arvex/.env`:

```env
PAYMENT_PORT=5001
ORDER_AUTOMATION_SECRET=generate-a-long-random-secret
ARVEX_DATA_DIR=/var/www/arvex/data

DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=1540991735595929680
DISCORD_TICKET_CATEGORY_ID=1540995191727722557
DISCORD_STAFF_ROLE_ID=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=https://arvex.host/api/automation/discord/callback
DISCORD_INTERACTION_PUBLIC_KEY=

PTERODACTYL_URL=https://panel.arvex.host
PTERODACTYL_API_KEY=
PTERODACTYL_NODE_ID=
PTERODACTYL_NEST_ID=
PTERODACTYL_EGG_ID=
PTERODACTYL_DOCKER_IMAGE=ghcr.io/pterodactyl/yolks:java_21
PTERODACTYL_STARTUP=java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar nogui

RESEND_API_KEY=
RESEND_FROM=ArveX Hosting <noreply@arvex.host>
PUBLIC_ORIGIN=https://arvex.host
```

Never put the bot token, Discord client secret, Pterodactyl API key or automation secret in a `VITE_` variable or frontend source.

## Systemd

```bash
cp /var/www/arvex/deploy/arvex-order-automation.service /etc/systemd/system/arvex-order-automation.service
systemctl daemon-reload
systemctl enable --now arvex-order-automation
systemctl status arvex-order-automation --no-pager
```

## Nginx

The automation API listens only on `127.0.0.1:5001`. Proxy `/api/automation/` to it **before** the existing generic `/api/` proxy to port 5000. Keep port 5001 private; do not expose it in the firewall.

Example inside the HTTPS `arvex.host` server block:

```nginx
location /api/automation/ {
    proxy_pass http://127.0.0.1:5001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

For Discord interactions, Discord must be configured to POST to:

`https://arvex.host/api/automation/discord/interactions`

The Discord application public key must match `DISCORD_INTERACTION_PUBLIC_KEY`.

## Behaviour

- Generates a unique `ARX-YYYYMMDD-XXXXXX` order ID.
- Stores orders atomically in `data/orders.json`.
- Creates a private Discord ticket under the configured category.
- Adds the customer Discord user and staff role to the ticket.
- Provides Claim, Payment Done, Order Info and Close buttons.
- Staff-only Payment Done changes state and starts idempotent provisioning.
- Creates the Pterodactyl user if necessary and creates the selected server.
- Sends the panel link to the ticket and privately to the customer's Discord DM.
- Sends a ready notification by email when Resend is configured.
- Prevents duplicate provisioning with a provisioning lock and `provisioned` state.
- Records payment verification actor/time and provisioning failures.

## Important integration note

The existing React context still contains demo/localStorage order and ticket actions. Those must call the real `/api/automation/orders` endpoint when checkout is wired to production automation. Do not expose the automation secret to React. A trusted server-side bridge must authenticate those requests.
