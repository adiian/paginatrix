# Paginatrix JS


## Using in an ExpressJS Web App

in the route(eg index.js)

```javascript
const Paginatrix = require("paginatrix");

    ...

    router.get('/page/:pagenumber?', async function(req, res){

        let currentPage = req.params.pagenumber || 1;

        ... 

        let pagination = {
            pages: paginatrix.getPages(posts.length, currentPage),
            buttons: paginatrix.getPrevNext(posts.length, currentPage)
        }

        pagination.pages.forEach(item => {

            if (item.page && item.page !== currentPage)
                item.href = item.page === 1 ? `/` : `/page/${item.page}/`

        })

        if (pagination.buttons.prev){
            pagination.buttons.prev.label = "Prev";
            pagination.buttons.prev.href = pagination.buttons.prev.page === 1 ? `/` : `/page/${pagination.buttons.prev.page}/`;
        }

        if (pagination.buttons.next){
            pagination.buttons.next.label = "Next";
            pagination.buttons.next.href = `/page/${pagination.buttons.next.page}/`;
        }  

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
    {{#if pagination.buttons.prev}}
        <a href="{{pagination.buttons.prev.href}}" style="margin-inline-end:auto;">
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
    {{#if pagination.buttons.next}}
        <a href="{{pagination.buttons.next.href}}" style="margin-inline-start:auto;">
            Next Page<span style='display:inline-block; margin: 0 1ch 0 1ch' aria-hidden='true'>→</span>
        </a>            
    {{else}}
        <span style="margin-inline-end:auto;width:10rem;"></span>
    {{/if}}    


</nav>
```
