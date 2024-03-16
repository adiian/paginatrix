* Trigger custom events when a new page is selected for client use(usefull for client usage)
* making it available via esm using imports

DONE:
* Added mapping method:
    default href: const hrefMapper = ( page => page === 1 ? `/` : `/page/${page}/` );
                pagination.setHrefs( mapper );