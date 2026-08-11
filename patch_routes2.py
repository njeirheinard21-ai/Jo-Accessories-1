import re

with open('src/routes/index.tsx', 'r') as f:
    text = f.read()

new_root_routes = """      { path: "settings", element: <AdminSettings /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />
  }
])"""

text = re.sub(r'      \{ path: "settings", element: <AdminSettings /> \},\n    \],\n  \}\n\]\)', new_root_routes, text)

with open('src/routes/index.tsx', 'w') as f:
    f.write(text)
