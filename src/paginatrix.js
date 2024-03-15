

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS-like environments that support module.exports, like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Paginatrix = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    
/**
* NaviPage Paginator is a utility for creating pagination structures. It calculates pagination based on total item count
* and current page, adapting the pagination output according to the provided options.
* 
* @class
* @param {Object} options Configuration options for the paginator.
* @param {number} options.pageSize Number of items per page, defaults to 10 if not provided or invalid.
*/
function Paginatrix(options){

    let RANGE_START = 0;
    let RANGE_INTERNAL = 2;
    let PAGE_SIZE = 10;
    let PAGES_CHUNK = 5;

    // TODO consistent mechanism with type check for all the params
    let opts = {
        includePrevNext: typeof options === 'object' && options.includePrevNext 
    }    

    PAGE_SIZE = 
        typeof options === 'object' 
        && options.pageSize 
        && Number(options.pageSize) === parseInt(options.pageSize, 10) && Number.isInteger(Number(options.pageSize))
        && Number(options.pageSize) > 0
        ? options.pageSize : PAGE_SIZE;

    /**
     * Maybe more intuitive pagination that splits an array in to parts, then based on the 
     * @param {*} count The total number of items that need to be paginated.
     * @param {*} currentPage The current page number that the user is viewing.
     * @returns  An array of objects where each object represents a page. 
     * 
     * Example: JSON.stringify(getPages(200, 7)) returns:
    [
        {
            "page": 1,
            "label": "1",
            "current": false
        },
        {
            "label": "...",
            "current": false
        },
        {
            "label": "<<",
            "current": false,
            "page": 5
        },
        {
            "page": 8,
            "label": "8",
            "current": false
        },
        {
            "page": 9,
            "label": "9",
            "current": false
        },
        {
            "page": 10,
            "label": "10",
            "current": true
        }
    ]
    */

    this.getPages = (count, currentPage) => {

        /**
         * Maybe more intuitive pagination that splits an array in to parts, then handle each array separately
         * each part is handled separately by addPart
         */
        count = parseInt(count)
        currentPage = parseInt(currentPage)
    
        let res = [];
        let pageCount = Math.ceil(count / PAGE_SIZE);
    
        let rangeHeads = RANGE_START;
        let rangeInternal = RANGE_INTERNAL;

        let currentCursor = Math.min(Math.max(currentPage, 1), pageCount);
    

        let partA = {start: 1, end: Math.min(currentPage - 1, pageCount)}
        let partB = {start: Math.max(1, currentPage + 1), end: pageCount}        

        
        this._addPart(res, partA.start, partA.end, rangeHeads, rangeInternal, 0, PAGES_CHUNK, currentCursor);
    
        if ( 1 <= currentPage && currentPage <= pageCount)
            res.push({ page:currentPage, label: currentPage.toString(), current: true })
    
        this._addPart(res, partB.start, partB.end, rangeInternal, rangeHeads, 1, PAGES_CHUNK, currentCursor);

        // include prev and last page 
        if (opts.includePrevNext){
            if (currentPage - 1 >= 1 && currentPage - 1 <= pageCount)
                res.unshift( {page: currentPage - 1, label: '<', current:false, type: "prev"} )
            else
                res.unshift( {current:false, label:" ", type: "prev"} )

            if (currentPage + 1 >= 1 && currentPage + 1 <= pageCount)
                res.push( {page: currentPage + 1, label: '>', current:false} )
            else
                res.push( {current:false, label:" ", type: "next"} )
        }
    
        return res
    }  

    /**
     * This function is intended to be used by getPages, but exposed separately to be tested in jasmine
     * @param {*} res The result array to which the pagination part will be added.
     * @param {*} part The starting page number for the part.
     * @param {*} rangeStart The number of pages to show at the beginning of the pagination part.
     * @param {*} rangeEnd The number of pages to show at the end of the pagination part.
     * @param {*} shift Indicates whether the navigation arrows should point to the beginning (0) or end (1) of the pagination.
     * @returns 
     */
    this._addPart = (res, start, end, rangeStart, rangeEnd, shift, pagesChunk, currentCursor) => {
        if ( end - start > rangeStart + rangeEnd + 2 ) {
            for (let i = start ; i <= start + rangeStart - shift; i++)
                res.push({page: i, label: i.toString(), current: false})

            shift === 0 
                ? res.push( {label: '...', current: false}, {label: '<<', current: false, page: currentCursor - pagesChunk } )
                : res.push( {label: '>>', current: false, page: currentCursor + pagesChunk - 1 }, {label: '...', current: false} )

            for (let i = end - rangeEnd + 1 - shift ; i <= end; i++)
                res.push({page: i, label: i.toString(), current: false}) 
        }
        else{
            for (let i = start; i <= end; i++)
                res.push({page: i, label: i.toString(), current: false})
        }

        return res
    }

    this.getPrevNext = (count, currentPage) => {
        let res = {}

        count = parseInt(count)
        currentPage = parseInt(currentPage)    
        
        let pageCount = Math.ceil(count / PAGE_SIZE);

        if (currentPage - 1 >= 1 && currentPage - 1 <= pageCount)
            res.prev = { page: currentPage - 1 };

        if (currentPage + 1 >= 1 && currentPage + 1 <= pageCount)
            res.next = { page: currentPage + 1 };

        return res;
    }    

 

}

return Paginatrix;
}));
