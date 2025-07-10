# Components

You can find the documentation of the various RSR components here.

Components are the building blocks of RSR that interact together to make a whole.
These are built on top of [django](https://djangoproject.com)

## Featured Components

### 🛡️ Memory Protection & Performance
RSR includes comprehensive memory protection mechanisms designed for production environments with large datasets and complex project hierarchies. The system provides TTL caching, deletion tracking, chunked processing, and aggregation depth protection to prevent memory exhaustion and ensure stable operation.

**Key Features:**
- Thread-safe TTL cache management with automatic cleanup
- Project deletion tracker to prevent signal handler memory leaks
- Chunked API response processing for large hierarchies
- Iterative aggregation with depth limits and circular reference detection
- Comprehensive monitoring and alerting capabilities

:::{toctree}
:maxdepth: 1

memory/index.md
results_framework/index.md
reports/index.md
projects.md
tasks.md
report_generation.md
:::
