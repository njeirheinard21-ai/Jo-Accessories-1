import re

with open('src/routes/index.tsx', 'r') as f:
    text = f.read()

# Add NotFound import
text = text.replace('import { PublicLayout } from "../layouts/PublicLayout"', 'import { PublicLayout } from "../layouts/PublicLayout"\nimport { NotFound } from "../pages/NotFound"')

# Add NotFound route
new_routes = """      { path: "account", element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
      { path: "*", element: <NotFound /> },
    ],
  },"""

text = text.replace("""      { path: "account", element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
    ],
  },""", new_routes)

# Also for the root array:
new_root_routes = """      { path: "settings", element: <AdminSettings /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />
  }
])"""

text = text.replace("""      { path: "settings", element: <AdminSettings /> },
    ],
  },
])""", new_root_routes)

with open('src/routes/index.tsx', 'w') as f:
    f.write(text)
