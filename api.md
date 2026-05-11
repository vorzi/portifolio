// API README

### `GET /api/v1/getThemes`

Returns:

```json
[
  {
    "settings": {
      "uuid": "Default Theme",
      "icon": "https://example.com/icon.png"
    },
    "readme": {
      "title": "optional"
    },
    "page": {
      "cursor": null,
      "sound": null,
      "background": "#000000",
      "backgroundFit": "cover",
      "font": null,
      "menuWhite": false,
      "threeD": {
        "enabled": true,
        "intensity": 15,
        "scale": 1.05,
        "perspective": 1000,
        "speed": 0.2
      },
      "profile": {
        "icon": "https://example.com/profile.png",
        "name": { "content": "Shadowstar", "color": "#ffffff", "effect": "none" },
        "biography": { "content": "My bio", "color": "rgba(255,255,255,0.7)" }
      },
      "box": {
        "opacity": 1,
        "borderRadius": 16,
        "padding": "20px",
        "fills": [{ "color": "#000000", "alpha": 0.2, "enabled": true }],
        "blurs": [{ "type": "background", "radius": 8, "enabled": true }],
        "shadows": [
          {
            "x": 0,
            "y": 10,
            "blur": 30,
            "spread": 0,
            "color": "#000000",
            "opacity": 0.35,
            "inset": false,
            "enabled": true
          }
        ],
        "border": { "color": "rgba(255,255,255,0.15)", "width": 1, "position": "inside", "enabled": true }
      },
      "middle": [
        { "type": "text", "content": "Hello **world**" },
        { "type": "component", "name": "discord" }
      ],
      "end": [
        { "icon": "https://example.com/github.png", "href": "https://github.com/your-user" }
      ]
    }
  }
]
```

Dont need a **secret Key**

### `POST /api/v1/addTheme`

Requires **secretKey** in body.

Body options:

```json
{
  "secretKey": "YOUR_SECRET_KEY",
  "uuid": "My Theme",
  "theme": { "...": "Theme object (same as GET /getThemes item)" }
}
```

or send the Theme object directly with `secretKey`:

```json
{
  "secretKey": "YOUR_SECRET_KEY",
  "settings": { "uuid": "My Theme", "icon": "https://..." },
  "page": { "...": "..." }
}
```

### `POST /api/v1/changeTheme`

Requires **secretKey** in body.

```json
{
  "secretKey": "YOUR_SECRET_KEY",
  "uuid": "My Theme",
  "theme": { "...": "Theme object" }
}
```

### `PUT /api/v1/changeTheme`

Same as POST. Requires **secretKey**.

### `DELETE /api/v1/delTheme`

Requires **secretKey** in body.

```json
{
  "secretKey": "YOUR_SECRET_KEY",
  "uuid": "My Theme"
}
```

