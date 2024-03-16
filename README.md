# Paginatrix JS

Paginatrix is a js pagination library, useable on both client and server, that returns a structure which represents the pages in a pagination. 

It is ui agnostic, but the result can be passed to template engines, or react like frameworks.

Along with a few options that can be specified on initialization(or later), using it is simple:

```javascript
    let pagination = paginatrix.paginate(posts.length, currentPage);
```

which returns the following:

```json
{
    "pages": [  // a list of pages
        {
            "type": "prev", // optionally prev and next pages are included in the list
            "page": 2,
            "label": "<",    // customizable label
            "current": false,
            "href": "/page/2/"    // optional, is a mapper is specified
        },
        {
            "page": 1,
            "label": "1",
            "current": false,
            "href": "/"
        },
        {
            "page": 2,
            "label": "2",
            "current": false,  // this flag can be used to set a different style 
            "href": "/page/2/"
        },
        {
            "page": 3,
            "label": "3",
            "current": true     // only the selected page will have current to true
                                // no href on current item
        },
        {
            "page": 4,
            "label": "4",
            "current": false,
            "href": "/page/4/"
        },
        {
            "page": 5,
            "label": "5",
            "current": false,
            "href": "/page/5/"
        },
        {
            "label": ">>",
            "current": false,
            "page": 7,
            "href": "/page/7/"
        },
        {
            "label": "...",
            "current": false       // this item has no href and no page
        },
        {
            "page": 11,
            "label": "11",
            "current": false,
            "href": "/page/11/"
        },
        {
            "page": 4,              // optional, similar to prev
            "label": ">",
            "current": false,
            "type": "next",
            "href": "/page/4/"
        }
    ],
    "prev": {                       // prev elements are added in pagination structure, in case custom elemnts need to be added(see bellow)
        "page": 2,
        "label": "<",
        "href": "/page/2/"
    },
    "next": {
        "page": 4,
        "label": ">",
        "href": "/page/4/"
    },
    "current": {                    // the current page is also returned, in case it is needed, could be usefull in a template engine
        "page": 3,
        "current": true
    },
    "selected": {                   // selected represent the selected page(if the current page is outside of boundaries
                                    // , like -1 or 999999999, this will be the first or the last )
        "page": 3,
        "current": true
    },
    "first": {                      // might be usefull in the template engine
        "page": 1,
        "current": false,
        "href": "/"
    },
    "last": {                       // again, might be usefull in the template engine
        "page": 11,
        "current": false,
        "href": "/page/11/"
    },
    "count": 105,                   // items count 
    "pageCount": 11                 // page count
}
```


## Using in an ExpressJS Web App

in the route(eg index.js)

```javascript
const Paginatrix = require("paginatrix");
paginatrix = new Paginatrix({
    setHrefs: true;
    hrefMapper: page => page => page === 1 ? `/` : `/page/${page}/`
})

paginatrix.includeHrefs( page => page => page === 1 ? `/` : `/page/${page}/` );
paginatrix.includePrevNext( { '<' => 'Prev', '>' => 'Next' } );

    ...

    router.get('/page/:pagenumber?', async function(req, res){

        let currentPage = req.params.pagenumber || 1;

        ... 

        let pagination = paginatrix.paginate(posts.length, currentPage);

        // default labels: < and >, to change to different labels(usefull for localization)
        if (pagination.prev) pagination.prev.label = "Prev";
        if (pagination.next) pagination.next.label = "Next";

        currentPage = Math.min(Math.max(currentPage, 1), pages.length);

        ... 

        res.render('home', { 
            ...
            pages:pages,
            ...
        })
    

    })

```

```paginatrix.hbs

<nav class="" style="display:flex" aria-label="Pagination">

    {{!-- rendering prev button or some empty space --}}
    {{#if pagination.prev}}
        <a href="{{pagination.prev.href}}" style="margin-inline-end:auto;">
            <span style='display:inline-block; margin: 0 1ch 0 1ch' aria-hidden='true'>←</span>Previous Page
        </a>
    {{else}}
        <span style="margin-inline-end:auto;width:10rem;"></span>
    {{/if}}
        
    
    {{!-- rentering pages buttons --}}
    <div>
        {{#each pagination.pages}}
            {{#if current}}
                <span aria-current="page" class="page-numbers current">{{label}}</span>
            {{else}}
                {{#if href}}
                    <a class="page-numbers" href="{{href}}">{{label}}</a>
                {{else}}
                    <span>{{label}}</span>
                {{/if}}
                            
            {{/if}}
        {{/each}}
        
    </div>

    {{!-- rendering next button or some empty space --}}
    {{#if pagination.next}}
        <a href="{{pagination.next.href}}" style="margin-inline-start:auto;">
            Next Page<span style='display:inline-block; margin: 0 1ch 0 1ch' aria-hidden='true'>→</span>
        </a>            
    {{else}}
        <span style="margin-inline-end:auto;width:10rem;"></span>
    {{/if}}    


</nav>
```
