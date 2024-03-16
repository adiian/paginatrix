const Paginatrix = require('../src/paginatrix');

describe("Paginatrix", function() {

    



    it('addPart', () => {

        let paginator = new Paginatrix();
        expect(toStr(paginator._addPart([], 1, 4, 0, 2, 0))).toEqual('1,2,3,4')
        expect(toStr(paginator._addPart([], 1, 5, 0, 2, 0))).toEqual('1,2,3,4,5')
        expect(toStr(paginator._addPart([], 1, 6, 0, 2, 0))).toEqual('1,...,<<,5,6')
        expect(toStr(paginator._addPart([], 1, 7, 0, 2, 0))).toEqual('1,...,<<,6,7')

        expect(toStr(paginator._addPart([], 1,  6, 2, 0, 1))).toEqual('1,2,>>,...,6')
        expect(toStr(paginator._addPart([], 6, 20, 2, 0, 1))).toEqual('6,7,>>,...,20')
    });
    

    function toStr(res){
        return res.map(p => !p.current ? p.label || p. page : `*${p.page}*` ).join(',')
    }

    it('getPagination with different page counts', () => {

        let paginator = new Paginatrix();

        expect(toStr(paginator._getPages(4, 1))).toEqual('*1*')
        expect(toStr(paginator._getPages(9, 5))).toEqual('1')
        expect(toStr(paginator._getPages(10, 10))).toEqual('1')
        expect(toStr(paginator._getPages(20, 2))).toEqual('1,*2*')
        expect(toStr(paginator._getPages(29, 2))).toEqual('1,*2*,3')
        expect(toStr(paginator._getPages(30, 2))).toEqual('1,*2*,3')

        expect(toStr(paginator._getPages(35, 2))).toEqual('1,*2*,3,4')

        expect(toStr(paginator._getPages(100, 6))).toEqual('1,2,3,4,5,*6*,7,8,9,10')
        expect(toStr(paginator._getPages(95, 6))).toEqual('1,2,3,4,5,*6*,7,8,9,10')
        expect(toStr(paginator._getPages(200, 5))).toEqual('1,2,3,4,*5*,6,7,>>,...,20')
        expect(toStr(paginator._getPages(200, 7))).toEqual('1,...,<<,5,6,*7*,8,9,>>,...,20')
        expect(toStr(paginator._getPages(200, 17))).toEqual('1,...,<<,15,16,*17*,18,19,20')

        // edge cases before
        // first page selected
        expect(toStr(paginator._getPages(100, 1))).toEqual('*1*,2,3,>>,...,10')      

        // some page selected below the first page(invalid page)
        expect(toStr(paginator._getPages(100, 0))).toEqual('1,2,>>,...,10')      
        expect(paginator._getPages(100, 0).map(p => p.page)).toEqual([1, 2, 5, undefined, 10]);
        expect(paginator._getPages(100, 0).map(p => p.label)).toEqual(['1', '2', '>>', "...", '10']);
        expect(paginator._getPages(100, 0).map(p => p.current)).toEqual([false, false, false, false, false]);  

        // some page selected way below the first page(invalid page)
        expect(paginator._getPages(100, -10).map(p => p.page)).toEqual([1, 2, 5, undefined, 10]);
        expect(paginator._getPages(100, -10).map(p => p.label)).toEqual(['1', '2', '>>', "...", '10']);
        expect(paginator._getPages(100, -10).map(p => p.current)).toEqual([false, false, false, false, false]);  

        // edge cases after
        // last page selected
        expect(paginator._getPages(100, 10).map(p => p.page)).toEqual([1, undefined, 5, 8, 9, 10]);
        expect(paginator._getPages(100, 10).map(p => p.label)).toEqual(['1', "...", '<<', '8', '9', '10']);
        expect(paginator._getPages(100, 10).map(p => p.current)).toEqual([false, false, false, false, false, true]);

        // some page selected after the last page(invalid page)
        expect(paginator._getPages(100, 11).map(p => p.page)).toEqual([1, undefined, 5, 9, 10]);
        expect(paginator._getPages(100, 11).map(p => p.label)).toEqual(['1', "...", '<<', '9', '10']);
        expect(paginator._getPages(100, 11).map(p => p.current)).toEqual([false, false, false, false, false]);    
        
        // some page selected way after the last page(invalid page)
        expect(paginator._getPages(100, 15).map(p => p.page)).toEqual([1, undefined, 5, 9, 10]);
        expect(paginator._getPages(100, 15).map(p => p.label || p.page)).toEqual(['1', "...", '<<', '9', '10']);
        expect(paginator._getPages(100, 15).map(p => p.current)).toEqual([false, false, false, false, false]);        

    });

    it('_setPrevNext: correctly sets previous and next pages', () => {
        let paginator = new Paginatrix({pageSize: 10, prevNextInList: true});
        let pagination = paginator.paginate(100, 5); // Assuming 100 items, page size of 10, on page 5

        // Check if the first and last items are prev and next buttons respectively
        expect(pagination.pages[0].type).toEqual("prev");
        expect(pagination.pages[pagination.pages.length - 1].type).toEqual("next");

        // Check specific labels for prev and next, based on default settings
        expect(pagination.pages[0].label).toEqual('<');
        expect(pagination.pages[pagination.pages.length - 1].label).toEqual('>');

        // Checks for prev and next page numbers
        expect(pagination.prev.page).toEqual(4);
        expect(pagination.next.page).toEqual(6);
    });

    it('_setHrefs: correctly assigns hrefs to pagination items', () => {
        const customHrefMapper = page => `/page=${page}`;
        let paginator = new Paginatrix({pageSize: 10, hrefMapper: customHrefMapper});
        let pagination = paginator.paginate(30, 2); // 30 items, page size of 10, on page 2

        // Check hrefs for a middle page, ensuring hrefMapper was used
        pagination.pages.forEach((item) => {
            if(item.page) { // Ensure we're not dealing with "...", which doesn't get an href
                if (!item.current)
                    expect(item.href).toEqual(customHrefMapper(item.page));
                else
                    expect(item.href).toBeUndefined();

            }
        });

        // Specifically check prev and next for hrefs if they exist
        if (pagination.prev) {
            expect(pagination.prev.href).toEqual(customHrefMapper(pagination.prev.page));
        }
        if (pagination.next) {
            expect(pagination.next.href).toEqual(customHrefMapper(pagination.next.page));
        }
    });

    it('paginage', () => {
        // TODO
    });
    

//    it('getPagination with different page counts', () => {
//        expect(_getPages(30, 1).map(p=>p.page)).toEqual([1, 2, 3])
//        expect(pages.map(p=>p.current)).toEqual([true,false,false])


//    })    
})